(ns wordbook.api
  (:require [compojure.core :refer [defroutes GET]]))

(defroutes routes
  (GET "/test" [] "test"))
