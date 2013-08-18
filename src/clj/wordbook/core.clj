(ns wordbook.core
  (:require [compojure.core :refer [defroutes]]
            [compojure.route :as route]
            [compojure.handler :as handler]
            [compojure.response :as response]))

(defroutes routes
  (route/resources "/")
  (route/not-found "404 - Page not found"))

(def app (handler/site routes))
