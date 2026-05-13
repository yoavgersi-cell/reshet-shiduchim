import { createRequire } from "module";
const require = createRequire(import.meta.url);

const bcrypt = require("bcryptjs");
const { PrismaNeonHttp } = require("@prisma/adapter-neon");
const { PrismaClient } = require("../src/generated/prisma/index.js");

const adapter = new PrismaNeonHttp(process.env.DATABASE_URL, {});
const prisma = new PrismaClient({ adapter });

const user = await prisma.user.findFirst({ where: { email: "admin@reshet.co" } });
if (!user) { console.error("משתמש לא נמצא"); process.exit(1); }

console.log("מוחק דאטה קיימת...");
await prisma.note.deleteMany({ where: { userId: user.id } });
await prisma.match.deleteMany({ where: { userId: user.id } });
await prisma.candidate.deleteMany({ where: { userId: user.id } });

const uid = user.id;

async function mkCandidate(data) {
  return prisma.candidate.create({ data: { ...data, userId: uid } });
}

console.log("יוצר מועמדים...");

const yonatan = await mkCandidate({ firstName: "יונתן", lastName: "לוי", gender: "MALE", age: 28, sector: "DATI", phone: "052-4411223", background: "גדל בירושלים, משפחה חמה ומגובשת. שירת בגולני, אחרי הצבא עשה שנה בישיבת הסדר ואז לימודי הנדסת תוכנה בטכניון. עובד בחברת סטארטאפ בת\"א.", lookingFor: "בחורה עם ערכים, חכמה ובעלת שאפתנות. חשוב לו שתהיה קשורה למשפחה ותרצה לבנות בית שבת קודש.", privateNotes: "מאוד חרוץ ורציני. קצת שקט בפגישה ראשונה אבל נפתח מהר. חוש הומור יבש נהדר." });
const uri = await mkCandidate({ firstName: "אורי", lastName: "כהן", gender: "MALE", age: 31, sector: "MASORTI", phone: "054-7733881", background: "ראשון לציון. רופא שיניים פרטי. בוגר האוניברסיטה העברית. מגיע ממשפחה מסורתית חזקה, אוהב בישול, גיטרה וטיולים בטבע.", lookingFor: "מחפש שותפה לחיים — לא מחפש שלמות, מחפש כימיה ואותנטיות. פתוח למי שיודעת מה היא רוצה.", privateNotes: "גרוש — נישואין קצרים לפני 3 שנים, ללא ילדים. מאוד בשל ורפלקטיבי. לא להעלות נושא אלא אם היא שואלת." });
const amit = await mkCandidate({ firstName: "עמית", lastName: "ברקוביץ", gender: "MALE", age: 26, sector: "HILONI", phone: "050-9988112", background: "תל אביב. מעצב גרפי פרילנסר שעובד עם חברות טק. למד בבצלאל. אוהב ג'אז, ריצה ומסעות בחו\"ל.", lookingFor: "בחורה עצמאית, יצירתית, שאוהבת להתפתח. לא חייבת להיות מהתחום אבל חשוב שתהיה סקרנית.", privateNotes: "טיפוס אמנותי, קצת לא סדיר בזמנים. מאוד נחמד ואמין — פשוט חי בקצב שלו." });
const nachman = await mkCandidate({ firstName: "נחמן", lastName: "פרידמן", gender: "MALE", age: 24, sector: "HAREDI", phone: "058-3344991", background: "בני ברק. למד בישיבת פוניבז'. לומד בכולל ובמקביל מתחיל ללמוד חשבונאות.", lookingFor: "בחורה ממשפחה טובה, יראת שמיים, שתתמוך בלמוד. מוכן לגור בב\"ב או ירושלים.", privateNotes: "ההורים מאוד מעורבים בחיפוש. חשוב לוודא שהמשפחה של הצד השני מקובלת עליהם." });
const daniel = await mkCandidate({ firstName: "דניאל", lastName: "שפירא", gender: "MALE", age: 29, sector: "DATI", phone: "052-1122334", background: "מודיעין. עורך דין בחברת הייטק. בוגר משפטים בר אילן. ממשפחה ציונית-דתית ערכית. אוהב ספורט, פודקאסטים ובישול.", lookingFor: "בחורה חכמה, בעלת קריירה, שגם רוצה משפחה גדולה. שמחפשת בית דתי מודרני.", privateNotes: "אחד המועמדים הכי טובים שיש לי. ממש רציני ואיכותי. צריך למצוא לו משהו מיוחד." });
const michael = await mkCandidate({ firstName: "מיכאל", lastName: "גולדשטיין", gender: "MALE", age: 33, sector: "MASORTI", phone: "054-5566778", background: "חיפה. מהנדס אזרחי בחברת בנייה. בוגר הטכניון. אוהב ים, צלילה ויין טוב.", lookingFor: "מחפש בחורה ים-תיכונית, חמה, משפחתית. לא חשוב לו קריירה גדולה — חשוב שתהיה שמחה.", privateNotes: "גיל מתקדם קצת, לכן יותר גמיש עם קריטריונים. מאוד נחמד וקרקעי." });

const mia = await mkCandidate({ firstName: "מיה", lastName: "אברהם", gender: "FEMALE", age: 25, sector: "DATI", phone: "052-8899001", background: "ירושלים. סטודנטית לפסיכולוגיה, שנה ג'. עבדה בשנת שירות בנוער בסיכון.", lookingFor: "מחפשת בחור שלומד/עובד, דתי לאומי, מחובר לירושלים. חשוב לה אינטגרציה של קריירה ומשפחה.", privateNotes: "חכמה ומיוחדת. קצת ביישנית בהתחלה. משפחה מגובשת — ירצו לפגוש את הבחור מהר." });
const shira = await mkCandidate({ firstName: "שירה", lastName: "מלול", gender: "FEMALE", age: 27, sector: "MASORTI", phone: "054-6677889", background: "אשדוד. מנהלת שיווק בחברת פינטק. בוגרת תקשורת ו-MBA. מגיעה ממשפחה מרוקאית חמה ותוססת.", lookingFor: "בחור מבוסס, בשל, שלא מפחד ממשפחה גדולה. חשוב לה שמכבד מסורת.", privateNotes: "יש לה 4 אחים שמגנים עליה — בחור שיכבד את זה יצליח. היא עצמה מדהימה." });
const noa = await mkCandidate({ firstName: "נועה", lastName: "בן-דוד", gender: "FEMALE", age: 24, sector: "HILONI", phone: "050-3344556", background: "תל אביב. UX designer בגוגל ישראל. בוגרת שנקר. אוהבת יוגה, קפה טוב ותרבות.", lookingFor: "בחור מעניין שאוהב לדבר על רעיונות גדולים. שיש לו עולם פנימי.", privateNotes: "כמה תאריכים לא הלכו כי הבחורים לא היו 'מספיק מעמיקים'. תסתדר עם עמית." });
const esther = await mkCandidate({ firstName: "אסתר", lastName: "שטרן", gender: "FEMALE", age: 22, sector: "HAREDI", phone: "058-7788990", background: "ירושלים. מלמדת בבית ספר יסודי. משפחה ירושלמית ממוצא הונגרי.", lookingFor: "בחור תלמיד חכם, עם עתיד, ממשפחה מכובדת. רוצה להיות עקרת בית.", privateNotes: "משפחה בודקת עמוק — יצרו קשר עם הרב של נחמן. נראה שמתאימים מאוד." });
const lior = await mkCandidate({ firstName: "ליאור", lastName: "חדד", gender: "FEMALE", age: 28, sector: "DATI", phone: "052-2233445", background: "רעננה. רופאה מתמחה בילדים בשניידר. למדה באוניברסיטת ת\"א. אוהבת ריצה ומסעות.", lookingFor: "מחפשת בחור בוגר שמבין שהקריירה שלה דורשת מחויבות. מישהו שנמצא איתה ולא מחכה שתהיה זמינה תמיד.", privateNotes: "לוחות זמנים קשים בגלל תורנויות. צריך בחור ממש בטוח בעצמו." });
const rachel = await mkCandidate({ firstName: "רחל", lastName: "גרוס", gender: "FEMALE", age: 26, sector: "MASORTI", phone: "054-4455667", background: "נתניה. חוקרת אוכלוסין בלשכה המרכזית לסטטיסטיקה. בוגרת כלכלה וסטטיסטיקה. אוהבת ספרים ובישול.", lookingFor: "בחור אינטלקטואל שיש לו סקרנות אינסופית. לא חשוב עשיר — חשוב חוש הומור ועומק.", privateNotes: "מושלמת בשביל אורי — שניהם בשלים, מחפשים אותנטיות. שווה לנסות." });

console.log("יוצר התאמות...");

const m1 = await prisma.match.create({ data: { userId: uid, candidate1Id: yonatan.id, candidate2Id: mia.id, status: "DATING" } });
const m2 = await prisma.match.create({ data: { userId: uid, candidate1Id: daniel.id, candidate2Id: lior.id, status: "APPROVED" } });
const m3 = await prisma.match.create({ data: { userId: uid, candidate1Id: nachman.id, candidate2Id: esther.id, status: "REVIEWING" } });
const m4 = await prisma.match.create({ data: { userId: uid, candidate1Id: amit.id, candidate2Id: noa.id, status: "SUGGESTED" } });
const m5 = await prisma.match.create({ data: { userId: uid, candidate1Id: uri.id, candidate2Id: shira.id, status: "DATING" } });
const m6 = await prisma.match.create({ data: { userId: uid, candidate1Id: michael.id, candidate2Id: rachel.id, status: "CLOSED" } });

console.log("יוצר הערות...");

const notes = [
  { matchId: m1.id, content: "שניהם חזרו נלהבים. יונתן אמר שהיא 'ממש לא מה שציפיתי — במובן הטוב'. מיה מתה עליו.", daysAgo: 14 },
  { matchId: m1.id, content: "פגישה שנייה — יצאו לטיול בעין כרם. 4 שעות ביחד. נראה שהולך מצוין.", daysAgo: 7 },
  { matchId: m1.id, content: "אמא של מיה התקשרה לבדוק. הורים של יונתן שמעו ומרוצים. פגישה שלישית בשבוע הבא.", daysAgo: 2 },
  { matchId: m2.id, content: "פגישה ראשונה הלכה מצוין. ליאור אמרה שהוא 'מפתיע'. דניאל אמר שהיא בדיוק מה שחיפש.", daysAgo: 21 },
  { matchId: m2.id, content: "הסכימו להמשיך — עוברים לשלב פגישות. שניהם מסונכרנים על הערכים. מאוד אופטימית.", daysAgo: 10 },
  { matchId: m3.id, content: "הצעתי לשני הצדדים — שניהם מעוניינים לבדוק. ממתינה לאישור מהרב של משפחת פרידמן.", daysAgo: 5 },
  { matchId: m4.id, content: "חושבת שיש כאן משהו — שניהם יצירתיים ותל-אביבים. עדיין לא הצעתי רשמית, בודקת קודם עם נועה.", daysAgo: 3 },
  { matchId: m5.id, content: "פגישה ראשונה — שתו קפה 3 שעות. שירה: 'ממש לא מה שציפיתי מרופא שיניים'. אורי ממש אהב אותה.", daysAgo: 30 },
  { matchId: m5.id, content: "פגישה שנייה — ארוחת ערב. המשפחה של שירה יודעת ומרוצה. אורי שאל אם אפשר לזרז.", daysAgo: 18 },
  { matchId: m5.id, content: "פגישה שלישית ורביעית עברו מצוין. אורי מאוד רציני. שירה מהססת — רוצה עוד זמן.", daysAgo: 5 },
  { matchId: m6.id, content: "פגישה ראשונה בחיפה. רחל אמרה שהוא 'נחמד מאוד אבל אין ניצוץ'.", daysAgo: 45 },
  { matchId: m6.id, content: "רחל הודיעה שאינה מעוניינת להמשיך. מיכאל הבין. סגור בכבוד.", daysAgo: 40 },
];

for (const n of notes) {
  await prisma.note.create({
    data: {
      userId: uid,
      entityType: "MATCH",
      matchId: n.matchId,
      content: n.content,
      createdAt: new Date(Date.now() - n.daysAgo * 24 * 60 * 60 * 1000),
    },
  });
}

const candidateNotes = [
  { candidateId: daniel.id, content: "שיחה ראשונה — נשמע בשל ומוכן. ממש נעים לדבר איתו.", daysAgo: 60 },
  { candidateId: lior.id, content: "אמרה שדחתה הצעות כי הבחורים לא הבינו את לוחות הזמנים שלה. צריך בחור עם חיים משלו.", daysAgo: 55 },
  { candidateId: uri.id, content: "שוחח על הגירושין — מפוכח ובשל. בטוח שמוכן לבית חדש.", daysAgo: 35 },
  { candidateId: mia.id, content: "התקשרה מיוזמתה לשאול אם יש לי מישהו. סימן טוב — רצינית ולא מחכה שהעולם יבוא אליה.", daysAgo: 50 },
];

for (const n of candidateNotes) {
  await prisma.note.create({
    data: {
      userId: uid,
      entityType: "CANDIDATE",
      candidateId: n.candidateId,
      content: n.content,
      createdAt: new Date(Date.now() - n.daysAgo * 24 * 60 * 60 * 1000),
    },
  });
}

console.log("✅ הדאטה הדמו מוכן!");
console.log("   12 מועמדים | 6 התאמות | הערות אמיתיות");
await prisma.$disconnect();
