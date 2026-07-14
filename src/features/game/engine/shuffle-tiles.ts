


//       ((((((خلط البلاطات))))))
type RandomSource = () => number;
//هذه تستخدم خوارزمية Fisher–Yates:
// تأخذ Array من البلاطات
// تنشئ نسخة منها حتى لا تعدل الأصل
// تبدأ من آخر بلاطة.
// تختار مكانًا عشوائيًا
// تبدّل البلاطتين
// ترجع Array جديدة مخلوطة

//استخدمت T
//لان ابيها تعمل مع اي نوع من البلاطات سواء كانت NumberTile او WindTile او DragonTile
//كparameter 
// لان ابي اختبره

export function shuffleTiles<T>(
  tiles: readonly T[],
  random: RandomSource = Math.random,
): T[] {
  const shuffledTiles = [...tiles];
// ذي الخوارزمية المشهوره Fisher-Yates Shuffle 
  for (let index = shuffledTiles.length - 1; index > 0; index -= 1) {
    const randomIndex = Math.floor(random() * (index + 1));

    [shuffledTiles[index], shuffledTiles[randomIndex]] = [
      shuffledTiles[randomIndex],
      shuffledTiles[index],
    ];
  }

  return shuffledTiles;
}