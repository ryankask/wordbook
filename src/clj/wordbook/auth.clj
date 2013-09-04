(ns wordbook.auth
  (require [ring.util.response :refer [response redirect]]
           [compojure.core :refer [defroutes GET POST]]))

(defn current-user [request]
  (get-in request [:session :user]))

(defn wrap-auth-required [handler]
  (fn [request]
    (if-not (current-user request)
      {:status 403
       :headers {"Content-Type" "text/html"}
       :body "<h1>403 - Not authorized</h1>"}
      (handler request))))

(defn authenticate [username password]
  (and (= username "ryan")
       (= password "password")))

(defroutes routes
  (GET "/check" request
    (response {"isAuthenticated"
               (boolean (current-user request))}))

  (POST "/login" [username password :as {session :session}]
    (let [auth-result (authenticate username password)
          auth-response (response {"isAuthenticated" auth-result})]
      (if auth-result
        (assoc auth-response :session (assoc-in session [:user :username] username)))
      auth-response))

  (POST "/logout" [:as {session :session}]
    (-> (response {"isAuthenticated" false})
        (assoc :session (assoc session :user nil)))))
