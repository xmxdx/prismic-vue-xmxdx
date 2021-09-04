// The Link Resolver takes a Prismic document as its argument
export default function(doc) {
  // Then it executes a switch to determine how to treat the item
  if (doc.type === "landing-page") {
    // If you have a singleton 'homepage' document, you return the root
    return "/";
  }
  if (doc.type === "cv") {
    return "/resume";
  }
  // Otherwise, return a 404
  return "/404";
}