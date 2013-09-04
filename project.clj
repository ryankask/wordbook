(defproject wordbook "0.1.0-SNAPSHOT"
  :description "An app that helps collect and define words."
  :url "https://words.kaskel.info"
  :license {:name "The MIT License (MIT)"
            :url "https://github.com/ryankask/wordbook/blob/master/LICENSE"}
  :source-paths ["src/clj"]
  :test-paths ["test/clj"]
  :dependencies [[org.clojure/clojure "1.5.1"]
                 [http-kit "2.1.10"]
                 [compojure "1.1.5"]
                 [ring/ring-json "0.2.0"]
                 [prismatic/dommy "0.1.1"]]
  :plugins [[lein-cljsbuild "0.3.2"]
            [lein-ring "0.8.7"]]
  :cljsbuild {:builds
              [{:source-paths ["src/cljs"]
                :compiler {:output-to "resources/public/js/lib/app.js"
                           :optimizations :whitespace
                           :pretty-print true}}]}
  :main wordbook.core
  :ring {:handler wordbook.core/app})
