(ns wordbook.api
  (:require [clojure.set :refer [subset?]]
            [ring.util.response :refer [response]]
            [compojure.core :refer [defroutes POST PUT]]
            [wordbook.datastore :as datastore]))

(def required-word-fields #{:word :pos :definition})

(defn valid-word? [params]
  (and (clojure.set/subset? required-word-fields (set (keys params)))
       (if (= (.toLowerCase (:pos params)) "noun")
         (contains? params :gender)
         true)))

(defn format-word [{:keys [word pos gender perfective definition notes _id _rev]}]
  (let [pos-kw (keyword (.toLowerCase pos))]
    (merge {:word word
            :pos pos-kw
            :definition definition}
           (if notes {:notes notes})
           (if (and _id _rev) {:_id _id :_rev _rev})
           (cond
            (= pos-kw :noun) {:gender (keyword (.toLowerCase gender))}
            (and (= pos-kw :verb) (not (nil? perfective))) {:perfective perfective}))))

(defn create-or-update-word [params]
  (if (valid-word? params)
    (-> params
        format-word
        datastore/put-word
        response)
    (response {:error "Invalid word."})))

(defroutes routes
  (POST "/words" {params :params}
    (create-or-update-word params))

  (PUT "/words/:id" {params :params}
    (let [id (:id params)]
      (cond
       (nil? id) (response {:error "No ID provided"})
       (nil? (:_rev params)) (response {:error "No revision provided"})
       :else (create-or-update-word (assoc params :_id id))))))
