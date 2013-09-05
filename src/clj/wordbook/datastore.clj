(ns wordbook.datastore
  (:require [com.ashafa.clutch :as clutch]))

(def db-name (or (System/getenv "WB_DATABASE_NAME") "wordbook"))
(def design-doc-id db-name)
(def db (clutch/get-database db-name))

(defn sync-views []
  (if-not (clutch/get-document db (str "_design/" design-doc-id))
    (clutch/save-view db design-doc-id
      (clutch/view-server-fns :javascript
        {:users-by-email
         {:map "function(doc) { emit(doc.email, doc) }"}}))))

(defn init []
  (sync-views))

(defn get-user-by-email [email]
  (let [users (clutch/get-view db design-doc-id :users-by-email {:key email})]
    (:value (first users))))
