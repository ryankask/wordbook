(ns wordbook.core-test
  (:require [clojure.test :refer :all]
            [wordbook.api :as api]))

(def test-full-word {:word "Clojure"
                     :pos "Noun"
                     :gender "n"
                     :definition "A programming language"
                     :perfective ""
                     :notes "These are some notes"})

(def test-noun (dissoc test-full-word :perfective :notes))

(def test-verb {:word "write"
                :pos "Verb"
                :definition "Mark symbols on a surface"})

(def test-adjective {:word "green"
                     :pos "Adjective"
                     :definition "Colored like grass or emeralds."})

(def test-updated-adjective {:word "green"
                             :pos "Adjective"
                             :definition "Colored like grass or emeralds."
                             :_id "123"
                             :_rev "abc"})

(deftest api-valid-word?
  (testing "Required fields"
    (is (api/valid-word? test-full-word))
    (is (api/valid-word? test-noun))
    (is (api/valid-word? test-verb))
    (is (api/valid-word? test-adjective))
    (is (not (api/valid-word? {})))
    (is (not (api/valid-word? (dissoc test-noun :word))))
    (is (not (api/valid-word? (dissoc test-noun :pos))))
    (is (not (api/valid-word? (dissoc test-noun :definition))))
    (is (not (api/valid-word? (dissoc test-noun :gender))))))

(deftest api-format-word
  (testing "Format noun"
    (let [formatted-word (api/format-word test-full-word)]
      (is (= (set (keys formatted-word)) #{:word :pos :gender :definition :notes}))
      (is (= (:pos formatted-word) :noun)))
    (is (= (set (keys (api/format-word test-noun)))
           #{:word :pos :gender :definition})))

  (testing "Format verb"
    (is (= (set (keys (api/format-word test-verb))) #{:word :pos :definition})))
    (is (= (set (keys (api/format-word (assoc test-verb :perfective "write"))))
           #{:word :pos :perfective :definition}))

  (testing "Format updated adjective"
    (is (= (set (keys (api/format-word test-updated-adjective)))
           #{:word :pos :definition :_id :_rev}))))

(deftest api-timestamp-word
  (testing "Add timestamps"
    (is (= (set (keys (api/timestamp-word {}))) #{:created :updated})))
    (is (= (set (keys (api/timestamp-word {:_id 1}))) #{:updated :_id})))
