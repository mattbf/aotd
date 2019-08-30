export function PrettyUrl(title) {
  var lowerCase = title.toLowerCase()
  var noSpace = lowerCase.split(' ').join('-')
  var url = noSpace.replace('--', '')
  return url
}
