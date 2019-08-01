const defaultSettings = {
  'mood': {
    'Indicative': true,
    'Subjunctive': true,
    'Imperative Affirmative': false,
    'Imperative Negative': false
  },
  'tense': {
    'Present': true,
    'Future': true,
    'Imperfect': true,
    'Preterite': true,
    'Conditional': true,
    'Present Perfect': true,
    'Future Perfect': true,
    'Past Perfect': true,
    'Preterite (Archaic)': true,
    'Conditional Perfect': false
  },
  "vosotros" : false
}

const verb_forms = [
  'form_1s', 
  'form_2s',
  'form_3s',
  'form_1p',
  'form_2p',
  'form_3p'
]

module.exports = {
  defaultSettings,
  verb_forms
};