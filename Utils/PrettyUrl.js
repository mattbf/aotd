function PrettyUrl(title) {
  var lowerNoSpace = title.toLowerCase().split(' ').join('-')
  var url = lowerNoSpace.replace('--', '')
  return url
}
