#setwd("~/Documents/Miashs /M1/S8/Outils et methodes en SC2 : Mesures comportementales/Projet/VisitedLinksExperience/datanalysis")

if (!require("jsonlite")) install.packages("jsonlite")
library(jsonlite)

# Téléchargement des fichiers JSON
base_url   <- "https://rafael.laboissiere.net/m1-miashs-2026-s8/ji3Sah2W/data/"
output_dir <- "./datanalysis/data"

if (!dir.exists(output_dir)) dir.create(output_dir, recursive = TRUE)

# Récupérer la liste des fichiers depuis l'index
page     <- readLines(url(base_url))
fichiers <- regmatches(page, regexpr('[0-9-]+\\.json', page))
fichiers <- unique(fichiers)

cat("Fichiers trouvés :", length(fichiers), "\n\n")

for (f in fichiers) {
  dest <- file.path(output_dir, f)
  cat("Téléchargement :", f, "... ")
  tryCatch({
    download.file(paste0(base_url, f), dest, mode = "wb", quiet = TRUE)
    cat("OK\n")
  }, error = function(e) cat("ERREUR :", e$message, "\n"))
}

cat("\nTéléchargement terminé ! Fichiers dans :", output_dir, "\n")

extract.participant <- function(json_data, filename) {
  
  participant_id <- gsub("\\.json$", "", basename(filename))
  
  # Fonction helper pour extraire une valeur ou retourner NA
  safe <- function(x) if (is.null(x)) NA else x
  
  age <- as.numeric(safe(json_data$utilisateur$age))
  
  # Exclure les mineurs
  if (!is.na(age) && age < 18) {
    cat("Participant exclu (mineur, âge:", age, ")\n")
    return(NULL)
  }
  
  participant_info <- data.frame(
    id          = participant_id,
    age         = age,
    genre       = ifelse(safe(json_data$utilisateur$genre) == 1, "male",
                         ifelse(safe(json_data$utilisateur$genre) == 2, "female", NA)),
    daltonism   = as.logical(safe(json_data$utilisateur$daltonisme)),
    dyslexia    = as.logical(safe(json_data$utilisateur$dyslexie)),
    stringsAsFactors = FALSE
  )
  
  return(participant_info)
}

# extraction des participants

extract.results <- function(json_data, participant_id) {
  
  if (is.null(json_data$questions) || length(json_data$questions) == 0) {
    return(NULL)
  }
  
  results_list <- lapply(json_data$questions, function(q) {
    data.frame(
      participant          = participant_id,
      testId               = as.integer(q$testId),
      ordreDansSession     = as.integer(q$ordreDansSession),
      textId               = as.character(q$textId),
      conditionId          = as.character(q$conditionId),
      linksCount           = as.integer(q$linksCount),
      hasColor             = as.logical(q$hasColor),
      question             = as.character(q$question),
      reponse              = as.character(q$reponse),
      correcte             = as.logical(q$correcte),
      revisits_cumulative  = as.integer(q$revisits_cumulative),
      unique_links_clicked = as.integer(q$unique_links_clicked),
      timestamp            = as.numeric(q$timestamp),
      stringsAsFactors = FALSE
    )
  })
  
  return(do.call(rbind, results_list))
}

# Filtre des Participant pour enlever les doublons

filter.latest <- function(donnees) {
  
  participants <- donnees$participants
  results      <- donnees$results
  
  # Extraire la date depuis l'id du participant
  participants$date <- as.POSIXct(participants$id, format = "%Y-%m-%d-%H-%M-%S")
  
  # Retirer les participants mineurs
  participants <- participants[!is.na(participants$age) & participants$age >= 18, ]
  
  # Joindre avec les résultats pour avoir le testId
  merged <- merge(
    participants,
    unique(results[, c("participant", "testId")]),
    by.x = "id", by.y = "participant"
  )
  
  # Pour chaque testId, garder uniquement le passage le plus récent
  merged <- merged[order(merged$testId, merged$date, decreasing = TRUE), ]
  merged <- merged[!duplicated(merged$testId), ]
  
  # Filtrer participants et résultats
  participants_filtered <- participants[participants$id %in% merged$id, ]
  participants_filtered$date <- NULL
  
  results_filtered <- results[results$participant %in% merged$id, ]
  
  cat("Participants avant filtre :", nrow(donnees$participants), "\n")
  cat("Participants mineurs exclus :", sum(donnees$participants$age < 18, na.rm = TRUE), "\n")
  cat("Participants après filtre  :", nrow(participants_filtered), "\n")
  
  return(list(participants = participants_filtered, results = results_filtered))
}


  
#extraction des données 
  
extract.all.json <- function(data_dir = "./datanalysis/data", output_dir = "./datanalysis/expe") {
  
  if (!dir.exists(output_dir)) dir.create(output_dir, recursive = TRUE)
  
  fichiers <- list.files(path = data_dir, pattern = "\\.json$", full.names = TRUE)
  
  if (length(fichiers) == 0) stop("Aucun fichier JSON trouvé dans ", data_dir)
  
  cat("Fichiers trouvés :", length(fichiers), "\n\n")
  
  all_participants <- data.frame()
  all_results      <- data.frame()
  
  for (fichier in fichiers) {
    cat("Traitement :", basename(fichier), "... ")
    
    tryCatch({
      json_data      <- fromJSON(fichier, simplifyVector = FALSE, simplifyDataFrame = FALSE)
      participant_id <- gsub("\\.json$", "", basename(fichier))
      
      # Participants
      p <- extract.participant(json_data, fichier)
      all_participants <- rbind(all_participants, p)
      
      # Résultats
      r <- extract.results(json_data, participant_id)
      if (!is.null(r)) all_results <- rbind(all_results, r)
      
      cat("OK\n")
      
    }, error = function(e) {
      cat("ERREUR :", e$message, "\n")
    })
  }
  
  # Supprimer doublons de participants
  all_participants <- all_participants[!duplicated(all_participants$id), ]
  
  # Sauvegarder les CSV
  write.csv(all_participants, file.path(output_dir, "participants.csv"), row.names = FALSE)
  write.csv(all_results,      file.path(output_dir, "results.csv"),      row.names = FALSE)
  
  #filtre des CSV pour exclure les passage non voulu
  write.csv(donnees_filtered$participants, 
            "./datanalysis/expe/participants_filtered.csv", row.names = FALSE)
  write.csv(donnees_filtered$results, 
            "./datanalysis/expe/results_filtered.csv", row.names = FALSE)
  
  cat("\n=== Terminé ===\n")
  cat("Participants :", nrow(all_participants), "\n")
  cat("Questions    :", nrow(all_results), "\n")
  cat("Fichiers dans:", output_dir, "\n")
  
  return(list(participants = all_participants, results = all_results))
}

donnees <- extract.all.json(
  data_dir   = "./datanalysis/data",
  output_dir = "./datanalysis/expe"
)

# Appliquer le filtre
donnees_filtered <- filter.latest(donnees)
cat("\n--- Aperçu participants ---\n")
print(head(donnees$participants))

cat("\n--- Aperçu résultats ---\n")
print(head(donnees$results))

rm(base_url,f, fichiers, page, json)
