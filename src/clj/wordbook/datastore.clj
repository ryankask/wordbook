(ns wordbook.datastore
  (:require [com.ashafa.clutch :as clutch]))

(def db-name (or (System/getenv "WB_DATABASE_NAME") "wordbook"))
(def design-doc-name db-name)
(def db (clutch/get-database db-name))

(defn sync-views []
  (let [design-doc-id (str "_design/" design-doc-name)
        design-doc (or (clutch/get-document db design-doc-id)
                       {:_id design-doc-id})]
    (clutch/put-document db
      (merge design-doc
             {:views
              {:users-by-email
               {:map "function(doc) {
                       if (doc.type === 'user') {
                         emit(doc.email, null)
                       }
                      }"}
               :words-by-update-time
               {:map "function(doc) {
                        if (doc.type === 'word') {
                          emit(doc.updated, null)
                        }
                      }"}
               :words-by-word
               {:map "function(doc) {
                        if (doc.type === 'word') {
                          emit(doc.word, null)
                        }
                      }"}}}))))

(defn get-user-by-email [email]
  (let [users (clutch/get-view db design-doc-name :users-by-email
                               {:key email :include_docs true})]
    (:doc (first users))))

(defn put-word [word-data]
  (let [word-entity (merge {:type "word"} word-data)]
    (clutch/put-document db word-entity)))

(defn get-latest-words [limit]
  (map #(:doc %) (clutch/get-view db design-doc-name :words-by-update-time
                                  {:limit limit
                                   :include_docs true
                                   :descending true})))
