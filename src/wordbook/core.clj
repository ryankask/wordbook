(ns wordbook.core
  (:require [compojure.core :refer [defroutes context GET]]
            [compojure.route :as route]
            [compojure.handler :as handler]
            [org.httpkit.server :as httpkit]
            [ring.middleware.json :as json]
            [ring.middleware.session.cookie :refer [cookie-store]]
            [ring.util.response :refer [resource-response]]
            [wordbook.auth :as auth]
            [wordbook.api :as api]))

(def session-settings
  (if-let [secret-key (System/getenv "WB_SECRET_KEY")]
    {:cookie-attrs {:secure (or (and (System/getenv "WB_PRODUCTION") true) false)}
     :store (cookie-store {:key secret-key})}
    (throw (Exception. "You must set a secret key."))))

(defroutes routes
  (GET "/" [] (resource-response "index.html" {:root "public"}))
  (context "/auth" [] auth/routes)
  (context "/api" [] (auth/wrap-auth-required api/routes))
  (route/resources "/")
  (route/not-found "404 - Page not found"))

(def app
  (-> routes
      (handler/site {:session session-settings})
      json/wrap-json-params
      json/wrap-json-response))

(defn start-server
  ([port]
     (defonce server (httpkit/run-server app {:port port})))
  ([]
     (start-server 8080)))

(defn -main []
  (start-server))
