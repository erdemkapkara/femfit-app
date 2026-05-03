const BAD_WORDS = [
  'fuck', 'shit', 'ass', 'bitch', 'bastard', 'damn', 'crap', 'hell',
  'piss', 'dick', 'cock', 'pussy', 'whore', 'slut', 'fag', 'nigger',
  'retard', 'idiot', 'stupid', 'moron', 'loser', 'hate', 'kill', 'die',
];

const PHONE_REGEX = /(\+?\d[\s\-.]?){7,15}/g;
const EMAIL_REGEX = /[a-zA-Z0-9._%+\-]+@[a-zA-Z0-9.\-]+\.[a-zA-Z]{2,}/g;

export function filterText(text: string): string {
  let filtered = text;
  BAD_WORDS.forEach(word => {
    const regex = new RegExp(`\\b${word}\\b`, 'gi');
    filtered = filtered.replace(regex, '***');
  });
  return filtered;
}

export function containsPersonalInfo(text: string): boolean {
  return PHONE_REGEX.test(text) || EMAIL_REGEX.test(text);
}

export function hasProfanity(text: string): boolean {
  return BAD_WORDS.some(word =>
    new RegExp(`\\b${word}\\b`, 'i').test(text)
  );
}
