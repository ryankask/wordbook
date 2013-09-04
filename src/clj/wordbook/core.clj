(ns wordbook.core
  (:require [compojure.core :refer [defroutes context]]
            [compojure.route :as route]
            [compojure.handler :as handler]
            [org.httpkit.server :as httpkit]
            [ring.middleware.json :as json]
            [wordbook.auth :as auth]
            [wordbook.api :as api]))

(defroutes routes
  (context "/auth" [] auth/routes)
  (context "/api" [] (auth/wrap-auth-required api/routes))
  (route/resources "/")
  (route/not-found "404 - Page not found"))

(def app
  (-> routes
      handler/site
      json/wrap-json-params
      json/wrap-json-response))

(defn start-server
  ([port]
     (defonce server (httpkit/run-server app {:port port})))
  ([]
     (start-server 8080)))

(defn -main []
  (start-server))
