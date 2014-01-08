(defproject wordbook "0.1.0-SNAPSHOT"
  :description "An app that helps collect and define words."
  :url "https://words.kaskel.info"
  :license {:name "The MIT License (MIT)"
            :url "https://github.com/ryankask/wordbook/blob/master/LICENSE"}
  :dependencies [[org.clojure/clojure "1.5.1"]
                 [ring/ring-json "0.2.0"]
                 [compojure "1.1.6"]
                 [http-kit "2.1.16"]
                 [com.ashafa/clutch "0.4.0-RC1"]
                 [clojurewerkz/scrypt "1.0.0"]
                 [clj-time "0.6.0"]]
  :plugins [[lein-ring "0.8.8"]]
  :main wordbook.core
  :ring {:handler wordbook.core/app})
