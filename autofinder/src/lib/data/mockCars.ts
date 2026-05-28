import type { CarModel } from '$lib/types';

export const mockCars: CarModel[] = [
	{
		slug: 'vw-golf-tdi',
		name: 'VW Golf TDI',
		brand: 'VW',
		type: 'Kompaktwagen',
		region: 'europe',
		warranty: 2,
		offers: [
			{ condition: 'used', price: 28900, mileage: 45000, color: 'schwarz', bodyType: 'kompakt', trunkSize: 380, drivetrain: 'combustion', power: 115, consumption: 5.2, co2: 137, seats: 5, features: ['climate', 'carplay', 'rearCam', 'parkAssist', 'laneAssist'] },
			{ condition: 'new',  price: 35900,                 color: 'weiss',   bodyType: 'kompakt', trunkSize: 380, drivetrain: 'combustion', power: 115, consumption: 5.2, co2: 137, seats: 5, features: ['climate', 'carplay', 'rearCam', 'parkAssist', 'laneAssist'] }
		],
		description: 'Der Klassiker — sparsam, zuverlässig, alltagstauglich.',
		detailText: "Rund CHF 130 Spritkosten pro Monat bei 15'000 km/Jahr — einer der sparsamsten Kompakten. Alle Alltagsfeatures serienmässig, 380 L Kofferraum für Einkäufe und Ausflüge. 2 Jahre Werksgarantie, erweiterbar auf 4 Jahre."
	},
	{
		slug: 'toyota-yaris-cross-hybrid',
		name: 'Toyota Yaris Cross Hybrid',
		brand: 'Toyota',
		type: 'Kompakt-SUV',
		region: 'asia',
		warranty: 3,
		offers: [
			{ condition: 'new',  price: 24900,                 color: 'weiss', bodyType: 'suv', trunkSize: 320, drivetrain: 'hybrid', power: 116, consumption: 4.8, co2: 107, seats: 5, features: ['climate', 'carplay', 'rearCam', 'adaptiveCruise', 'awd'] },
			{ condition: 'used', price: 19500, mileage: 35000, color: 'grau',  bodyType: 'suv', trunkSize: 320, drivetrain: 'hybrid', power: 116, consumption: 4.8, co2: 107, seats: 5, features: ['climate', 'carplay', 'rearCam', 'adaptiveCruise', 'awd'] }
		],
		description: 'Sparsamer Vollhybrid mit hoher Sitzposition — ideal für die Stadt.',
		detailText: 'Als Vollhybrid schaltet das System automatisch auf E-Betrieb im Stop-and-Go — kein Aufladen nötig. Ideal für Stadtfahrten und kurze Pendlerstrecken. Toyota bietet 10 Jahre Hybridgarantie.'
	},
	{
		slug: 'bmw-320d',
		name: 'BMW 3er 320d',
		brand: 'BMW',
		type: 'Mittelklasse-Limousine',
		region: 'europe',
		warranty: 2,
		offers: [
			{ condition: 'new',  price: 46500,                 color: 'schwarz', bodyType: 'limousine', trunkSize: 480, drivetrain: 'combustion', power: 190, consumption: 4.9, co2: 129, seats: 5, features: ['climate', 'leather', 'carplay', 'navigation', 'rearCam', 'adaptiveCruise', 'laneAssist', 'seatHeating', 'parkAssist'] },
			{ condition: 'used', price: 36000, mileage: 40000, color: 'silber',  bodyType: 'limousine', trunkSize: 480, drivetrain: 'combustion', power: 190, consumption: 4.9, co2: 129, seats: 5, features: ['climate', 'leather', 'carplay', 'navigation', 'rearCam', 'adaptiveCruise', 'laneAssist', 'seatHeating', 'parkAssist'] }
		],
		description: '190 PS, Ledersitze, Navigation — Business-Klasse mit Fahrspass.',
		detailText: '190 PS für entspanntes Überholen, komfortabel gefedert für lange Autobahnfahrten. Ledersitze und Navigationssystem serienmässig — Business-Klasse ohne teure Optionen. Hoher Restwert nach 4 Jahren.'
	},
	{
		slug: 'tesla-model-3',
		name: 'Tesla Model 3 RWD',
		brand: 'Tesla',
		type: 'Mittelklasse-Limousine',
		region: 'america',
		warranty: 4,
		offers: [
			{ condition: 'new',  price: 42990,                 color: 'weiss',   bodyType: 'limousine', trunkSize: 594, drivetrain: 'electric', power: 283, consumption: 14.2, co2: 0, seats: 5, features: ['climate', 'carplay', 'navigation', 'surroundCam', 'adaptiveCruise', 'laneAssist', 'wirelessCharging', 'hud'] },
			{ condition: 'used', price: 33500, mileage: 30000, color: 'schwarz', bodyType: 'limousine', trunkSize: 594, drivetrain: 'electric', power: 283, consumption: 14.2, co2: 0, seats: 5, features: ['climate', 'carplay', 'navigation', 'surroundCam', 'adaptiveCruise', 'laneAssist', 'wirelessCharging', 'hud'] }
		],
		description: '283 PS, 491 km Reichweite, 0 Emissionen — vollständig vernetzt.',
		detailText: "Ca. CHF 55 Stromkosten pro Monat bei Heimladung (15'000 km/Jahr). Kein Ölwechsel, kaum Bremsverschleiss — Unterhaltskosten deutlich tiefer als beim Verbrenner. OTA-Updates verbessern das Auto kontinuierlich."
	},
	{
		slug: 'renault-zoe',
		name: 'Renault Zoe',
		brand: 'Renault',
		type: 'Kleinwagen',
		region: 'europe',
		warranty: 3,
		offers: [
			{ condition: 'used', price: 29900, mileage: 40000, color: 'weiss', bodyType: 'kleinwagen', trunkSize: 338, drivetrain: 'electric', power: 100, consumption: 17.7, co2: 0, seats: 5, features: ['climate', 'carplay', 'rearCam', 'parkAssist'] }
		],
		description: 'Der günstige Einstieg ins Elektrofahren — perfekt für die Stadt.',
		detailText: 'CHF 50 Strom pro Monat bei Normaltarif. Perfekt für die Stadt — wendig, einfach zu parken und schnell an der Wallbox geladen. Reichweite bis 395 km für entspannte Alltagsfahrten.'
	},
	{
		slug: 'toyota-rav4-hybrid',
		name: 'Toyota RAV4 Hybrid',
		brand: 'Toyota',
		type: 'Kompakt-SUV',
		region: 'asia',
		warranty: 3,
		offers: [
			{ condition: 'new',  price: 42900,                 color: 'weiss', bodyType: 'suv', trunkSize: 580, drivetrain: 'hybrid', power: 218, consumption: 5.4, co2: 123, seats: 5, features: ['climate', 'carplay', 'navigation', 'rearCam', 'adaptiveCruise', 'laneAssist', 'awd', 'seatHeating', 'towHitch'] },
			{ condition: 'used', price: 34500, mileage: 50000, color: 'grau',  bodyType: 'suv', trunkSize: 580, drivetrain: 'hybrid', power: 218, consumption: 5.4, co2: 123, seats: 5, features: ['climate', 'carplay', 'navigation', 'rearCam', 'adaptiveCruise', 'laneAssist', 'awd', 'seatHeating', 'towHitch'] }
		],
		description: 'Geräumiger Familienkombi mit AWD und Hybrid-Effizienz.',
		detailText: 'Kein Stecker nötig: das Hybridsystem lädt sich selbst. AWD-Traktion für Skiurlaub und Schlechtwetter, 580 L Kofferraum für die ganze Familie plus Gepäck. 10 Jahre Hybridgarantie.'
	},
	{
		slug: 'vw-passat-variant-tdi',
		name: 'VW Passat Variant TDI',
		brand: 'VW',
		type: 'Kombi',
		region: 'europe',
		warranty: 2,
		offers: [
			{ condition: 'new',  price: 39900,                 color: 'schwarz', bodyType: 'kombi', trunkSize: 650, drivetrain: 'combustion', power: 150, consumption: 5.6, co2: 148, seats: 5, features: ['climate', 'carplay', 'navigation', 'rearCam', 'adaptiveCruise', 'laneAssist', 'towHitch', 'roofRails', 'parkAssist'] },
			{ condition: 'used', price: 29500, mileage: 55000, color: 'grau',   bodyType: 'kombi', trunkSize: 650, drivetrain: 'combustion', power: 150, consumption: 5.6, co2: 148, seats: 5, features: ['climate', 'carplay', 'navigation', 'rearCam', 'adaptiveCruise', 'laneAssist', 'towHitch', 'roofRails', 'parkAssist'] }
		],
		description: '650 L Kofferraum, Anhängerkupplung serienmässig — der Allrounder.',
		detailText: "150 PS und 380 Nm Drehmoment — auch mit beladenem Anhänger souverän. Dachreling und AHK serienmässig, ideal als Familienkombi oder Dienstfahrzeug. Ca. CHF 140 Diesel pro Monat bei 15'000 km."
	},
	{
		slug: 'skoda-octavia-combi-tdi',
		name: 'Skoda Octavia Combi TDI',
		brand: 'Skoda',
		type: 'Kombi',
		region: 'europe',
		warranty: 2,
		offers: [
			{ condition: 'used', price: 31500, mileage: 60000, color: 'schwarz', bodyType: 'kombi', trunkSize: 640, drivetrain: 'combustion', power: 115, consumption: 5.0, co2: 132, seats: 5, features: ['climate', 'carplay', 'rearCam', 'parkAssist', 'towHitch', 'roofRails'] },
			{ condition: 'new',  price: 37900,                 color: 'weiss',   bodyType: 'kombi', trunkSize: 640, drivetrain: 'combustion', power: 115, consumption: 5.0, co2: 132, seats: 5, features: ['climate', 'carplay', 'rearCam', 'parkAssist', 'towHitch', 'roofRails'] }
		],
		description: 'Grösster Kofferraum seiner Klasse — das praktische Vernunftauto.',
		detailText: "640 L Kofferraum — mehr als viele SUVs. Gleiche Technik wie Golf, aber mehr Platz für weniger Geld. Ca. CHF 125 Spritkosten pro Monat bei 15'000 km — sparsam trotz grossem Format."
	},
	{
		slug: 'hyundai-ioniq-6',
		name: 'Hyundai Ioniq 6',
		brand: 'Hyundai',
		type: 'Mittelklasse-Limousine',
		region: 'asia',
		warranty: 5,
		offers: [
			{ condition: 'new', price: 45990, color: 'weiss', bodyType: 'limousine', trunkSize: 401, drivetrain: 'electric', power: 226, consumption: 14.3, co2: 0, seats: 5, features: ['climate', 'carplay', 'navigation', 'rearCam', 'adaptiveCruise', 'laneAssist', 'wirelessCharging', 'hud', 'seatHeating'] }
		],
		description: 'Schnellster Lader seiner Klasse — 10–80 % in 18 Minuten.',
		detailText: 'Schnell laden: 10–80 % in 18 Minuten am 800V-Schnelllader. Head-up-Display und Wireless CarPlay serienmässig. 5 Jahre Garantie — die beste Herstellergarantie in dieser Klasse.'
	},
	{
		slug: 'mercedes-glc-220d',
		name: 'Mercedes GLC 220d',
		brand: 'Mercedes',
		type: 'Mittelklasse-SUV',
		region: 'europe',
		warranty: 2,
		offers: [
			{ condition: 'new', price: 59900, color: 'schwarz', bodyType: 'suv', trunkSize: 620, drivetrain: 'combustion', power: 197, consumption: 6.1, co2: 162, seats: 5, features: ['climate', 'leather', 'carplay', 'navigation', 'surroundCam', 'adaptiveCruise', 'laneAssist', 'blindSpot', 'seatHeating', 'steeringWheelHeating', 'electricTailgate', 'panoramaRoof'] }
		],
		description: 'Vollausstattung serienmässig — Premium ohne Optionsliste.',
		detailText: 'Leder, Panoramaglas, 360°-Kamera — serienmässig ohne Optionspakete. Wertverlust unter dem Marktschnitt: nach 4 Jahren noch über 55 % Restwert. Der Kauf, der sich langfristig rechnet.'
	},
	{
		slug: 'mazda-cx5-skyactiv',
		name: 'Mazda CX-5 Skyactiv-D',
		brand: 'Mazda',
		type: 'Mittelklasse-SUV',
		region: 'asia',
		warranty: 3,
		offers: [
			{ condition: 'new',  price: 36900,                 color: 'schwarz', bodyType: 'suv', trunkSize: 506, drivetrain: 'combustion', power: 150, consumption: 5.8, co2: 153, seats: 5, features: ['climate', 'carplay', 'navigation', 'rearCam', 'awd', 'laneAssist', 'adaptiveCruise', 'seatHeating'] },
			{ condition: 'used', price: 28500, mileage: 45000, color: 'silber',  bodyType: 'suv', trunkSize: 506, drivetrain: 'combustion', power: 150, consumption: 5.8, co2: 153, seats: 5, features: ['climate', 'carplay', 'navigation', 'rearCam', 'awd', 'laneAssist', 'adaptiveCruise', 'seatHeating'] }
		],
		description: 'Sparsamer Diesel mit AWD — Premiumgefühl zum fairen Preis.',
		detailText: 'Sparsamer Diesel mit AWD für Bergfahrten und unebene Strassen. Premiumgefühl im Innenraum ohne Premiumpreis — Mazda überzeugt bei Verarbeitungsqualität. 3 Jahre Garantie serienmässig.'
	},
	{
		slug: 'fiat-500e',
		name: 'Fiat 500e',
		brand: 'Fiat',
		type: 'Kleinwagen',
		region: 'europe',
		warranty: 2,
		offers: [
			{ condition: 'new', price: 29500, color: 'weiss', bodyType: 'kleinwagen', trunkSize: 185, drivetrain: 'electric', power: 87, consumption: 14.9, co2: 0, seats: 4, features: ['climate', 'carplay', 'rearCam', 'parkAssist'] }
		],
		description: 'Stylisch, wendig, elektrisch — der Stadtwagen der Extraklasse.',
		detailText: 'Perfekt für die Stadt: 8.5 m Wendekreis, einfach zu parken. Kaum Unterhaltskosten — kein Öl, kaum Bremsen. Die Reichweite reicht für 90 % aller Alltagsfahrten entspannt.'
	},
	{
		slug: 'volvo-xc40-recharge',
		name: 'Volvo XC40 Recharge',
		brand: 'Volvo',
		type: 'Kompakt-SUV',
		region: 'europe',
		warranty: 4,
		offers: [
			{ condition: 'new', price: 55900, color: 'schwarz', bodyType: 'suv', trunkSize: 452, drivetrain: 'electric', power: 231, consumption: 18.1, co2: 0, seats: 5, features: ['climate', 'carplay', 'navigation', 'rearCam', 'adaptiveCruise', 'laneAssist', 'awd', 'seatHeating', 'steeringWheelHeating', 'electricTailgate', 'wirelessCharging'] }
		],
		description: 'Sicherheitssieger mit Vollausstattung — Volvo-Qualität elektrisch.',
		detailText: 'Sicherheitssieger in seiner Klasse — 5 Sterne NCAP. Vollausstattung serienmässig, keine teuren Optionspakete. 231 PS AWD für entspannte Autobahn- und Bergfahrten.'
	},
	{
		slug: 'ford-kuga-phev',
		name: 'Ford Kuga PHEV',
		brand: 'Ford',
		type: 'Kompakt-SUV',
		region: 'america',
		warranty: 3,
		offers: [
			{ condition: 'new', price: 41500, color: 'schwarz', bodyType: 'suv', trunkSize: 402, drivetrain: 'hybrid', power: 225, consumption: 1.4, co2: 31, seats: 5, features: ['climate', 'carplay', 'navigation', 'rearCam', 'adaptiveCruise', 'laneAssist', 'awd', 'seatHeating', 'towHitch', 'wirelessCharging'] }
		],
		description: 'Plug-in Hybrid mit 50 km E-Reichweite — flexibel für jeden Alltag.',
		detailText: 'Bis 50 km rein elektrisch für Kurzpendler. Du lädst abends zu Hause und die meisten Alltagsfahrten fährst du kostenlos. Auf langen Strecken läuft der Benziner — kein Reichweiten-Stress.'
	},
	{
		slug: 'audi-a4-tdi',
		name: 'Audi A4 35 TDI',
		brand: 'Audi',
		type: 'Mittelklasse-Limousine',
		region: 'europe',
		warranty: 2,
		offers: [
			{ condition: 'new',  price: 44900,                 color: 'schwarz', bodyType: 'limousine', trunkSize: 460, drivetrain: 'combustion', power: 163, consumption: 5.0, co2: 131, seats: 5, features: ['climate', 'leather', 'carplay', 'navigation', 'rearCam', 'adaptiveCruise', 'laneAssist', 'seatHeating', 'parkAssist'] },
			{ condition: 'used', price: 34000, mileage: 38000, color: 'silber',  bodyType: 'limousine', trunkSize: 460, drivetrain: 'combustion', power: 163, consumption: 5.0, co2: 131, seats: 5, features: ['climate', 'leather', 'carplay', 'navigation', 'rearCam', 'adaptiveCruise', 'laneAssist', 'seatHeating', 'parkAssist'] }
		],
		description: 'Edle Verarbeitung, 163 PS Diesel — Audi-Qualität im Alltag.',
		detailText: "Edlere Verarbeitung als viele Konkurrenten in dieser Klasse. 163 PS für entspanntes Fahren, Lederlenkrad und Navigation serienmässig. Ca. CHF 125 Diesel pro Monat bei 15'000 km."
	},
	{
		slug: 'kia-ev6',
		name: 'Kia EV6',
		brand: 'Kia',
		type: 'Mittelklasse-SUV',
		region: 'asia',
		warranty: 7,
		offers: [
			{ condition: 'new', price: 47990, color: 'weiss', bodyType: 'suv', trunkSize: 480, drivetrain: 'electric', power: 229, consumption: 16.5, co2: 0, seats: 5, features: ['climate', 'carplay', 'navigation', 'rearCam', 'adaptiveCruise', 'laneAssist', 'wirelessCharging', 'hud', 'seatHeating', 'surroundCam'] }
		],
		description: '7 Jahre Garantie, 800V-Lader — Kias beeindruckender Elektro-SUV.',
		detailText: 'Lädt von 10–80 % in 18 Minuten. 7 Jahre Herstellergarantie — die längste in dieser Klasse. Head-up-Display und 360°-Kamera serienmässig. Monatliche Stromkosten ca. CHF 60.'
	},
	{
		slug: 'honda-crv-hybrid',
		name: 'Honda CR-V e:HEV',
		brand: 'Honda',
		type: 'Mittelklasse-SUV',
		region: 'asia',
		warranty: 5,
		offers: [
			{ condition: 'new',  price: 44900,                 color: 'weiss',   bodyType: 'suv', trunkSize: 561, drivetrain: 'hybrid', power: 184, consumption: 5.3, co2: 119, seats: 5, features: ['climate', 'carplay', 'navigation', 'rearCam', 'adaptiveCruise', 'laneAssist', 'awd', 'seatHeating', 'electricTailgate', 'wirelessCharging'] },
			{ condition: 'used', price: 36000, mileage: 30000, color: 'schwarz', bodyType: 'suv', trunkSize: 561, drivetrain: 'hybrid', power: 184, consumption: 5.3, co2: 119, seats: 5, features: ['climate', 'carplay', 'navigation', 'rearCam', 'adaptiveCruise', 'laneAssist', 'awd', 'seatHeating', 'electricTailgate', 'wirelessCharging'] }
		],
		description: 'Vollhybrid mit AWD — geräumig, effizient, zuverlässig.',
		detailText: 'Honda Sensing (komplettes Assistenzpaket) serienmässig. 561 L Kofferraum, elektrische Heckklappe. Kein Stecker nötig — lädt sich selbst. 5 Jahre Garantie ohne Aufpreis.'
	},
	{
		slug: 'peugeot-308',
		name: 'Peugeot 308 PureTech',
		brand: 'Peugeot',
		type: 'Kompaktwagen',
		region: 'europe',
		warranty: 2,
		offers: [
			{ condition: 'new', price: 26900, color: 'weiss', bodyType: 'kompakt', trunkSize: 412, drivetrain: 'combustion', power: 130, consumption: 5.6, co2: 128, seats: 5, features: ['climate', 'carplay', 'rearCam', 'laneAssist', 'parkAssist'] }
		],
		description: 'Französisches Design, modernes Cockpit, guter Preis.',
		detailText: "Auffälligstes Cockpit seiner Klasse — i-Cockpit mit kleinem Lenkrad und hochgelegten Instrumenten. 130 PS für entspanntes Stadtfahren. Ca. CHF 140 Spritkosten pro Monat bei 15'000 km."
	},
	{
		slug: 'vw-id3',
		name: 'VW ID.3 Pro',
		brand: 'VW',
		type: 'Kompaktwagen',
		region: 'europe',
		warranty: 2,
		offers: [
			{ condition: 'new',  price: 37900,                 color: 'weiss', bodyType: 'kompakt', trunkSize: 385, drivetrain: 'electric', power: 204, consumption: 15.4, co2: 0, seats: 5, features: ['climate', 'carplay', 'navigation', 'rearCam', 'adaptiveCruise', 'laneAssist', 'wirelessCharging', 'parkAssist'] },
			{ condition: 'used', price: 29500, mileage: 25000, color: 'grau',  bodyType: 'kompakt', trunkSize: 385, drivetrain: 'electric', power: 204, consumption: 15.4, co2: 0, seats: 5, features: ['climate', 'carplay', 'navigation', 'rearCam', 'adaptiveCruise', 'laneAssist', 'wirelessCharging', 'parkAssist'] }
		],
		description: 'VWs Einstieg ins Elektrozeitalter — vertraut, kompakt, elektrisch.',
		detailText: "Bekannte VW-Qualität, nun elektrisch. 425 km Reichweite für sorgenfreies Pendeln. Ca. CHF 50 Strom pro Monat bei 15'000 km. Platzverhältnisse wie ein Golf, deutlich mehr Technologie."
	},
	{
		slug: 'vw-id4',
		name: 'VW ID.4 Pro',
		brand: 'VW',
		type: 'Kompakt-SUV',
		region: 'europe',
		warranty: 2,
		offers: [
			{ condition: 'new', price: 44900, color: 'weiss', bodyType: 'suv', trunkSize: 543, drivetrain: 'electric', power: 210, consumption: 17.1, co2: 0, seats: 5, features: ['climate', 'carplay', 'navigation', 'rearCam', 'adaptiveCruise', 'laneAssist', 'awd', 'wirelessCharging', 'parkAssist', 'seatHeating'] }
		],
		description: 'Elektrischer SUV mit viel Platz und vertrauter VW-Bedienung.',
		detailText: "543 L Kofferraum, 520 km Reichweite. AWD optional für Wintersicherheit. Identische Bedienung wie Golf — null Umgewöhnung. Ca. CHF 55 Strom pro Monat bei 15'000 km."
	},
	{
		slug: 'skoda-enyaq',
		name: 'Skoda Enyaq iV',
		brand: 'Skoda',
		type: 'Kompakt-SUV',
		region: 'europe',
		warranty: 2,
		offers: [
			{ condition: 'new', price: 41900, color: 'schwarz', bodyType: 'suv', trunkSize: 585, drivetrain: 'electric', power: 204, consumption: 16.3, co2: 0, seats: 5, features: ['climate', 'carplay', 'navigation', 'rearCam', 'adaptiveCruise', 'laneAssist', 'seatHeating', 'wirelessCharging', 'electricTailgate', 'roofRails'] }
		],
		description: 'Grösster Kofferraum unter den E-SUVs — Skoda-Pragmatismus elektrisch.',
		detailText: "585 L Kofferraum — mehr als die meisten Konkurrenten. Gleiche Technikbasis wie VW ID.4, aber mehr Platz für weniger Geld. Elektrische Heckklappe serienmässig. Ca. CHF 55 Strom pro Monat."
	},
	{
		slug: 'nissan-leaf',
		name: 'Nissan Leaf e+',
		brand: 'Nissan',
		type: 'Kompaktwagen',
		region: 'asia',
		warranty: 3,
		offers: [
			{ condition: 'used', price: 33900, mileage: 35000, color: 'weiss', bodyType: 'kompakt', trunkSize: 420, drivetrain: 'electric', power: 217, consumption: 18.0, co2: 0, seats: 5, features: ['climate', 'carplay', 'navigation', 'rearCam', 'adaptiveCruise', 'laneAssist', 'parkAssist'] }
		],
		description: 'Der Pionier unter den Elektroautos — bewährt und erschwinglich.',
		detailText: "Seit über 10 Jahren auf dem Markt — bewährtestes Elektroauto überhaupt. 385 km Reichweite, günstigster Preis seiner Klasse. Ca. CHF 55 Strom pro Monat bei 15'000 km."
	},
	{
		slug: 'toyota-corolla-touring',
		name: 'Toyota Corolla Touring Sports',
		brand: 'Toyota',
		type: 'Kombi',
		region: 'asia',
		warranty: 3,
		offers: [
			{ condition: 'new', price: 31900, color: 'weiss', bodyType: 'kombi', trunkSize: 596, drivetrain: 'hybrid', power: 122, consumption: 4.9, co2: 111, seats: 5, features: ['climate', 'carplay', 'rearCam', 'adaptiveCruise', 'laneAssist', 'parkAssist', 'roofRails'] }
		],
		description: 'Geräumiger Hybrid-Kombi — sparsam, zuverlässig, viel Platz.',
		detailText: "596 L Kofferraum im Hybrid-Kombi — ideal für Familien mit Gepäck. Toyota Safety Sense serienmässig. Kein Aufladen nötig. Ca. CHF 120 Spritkosten pro Monat bei 15'000 km."
	},
	{
		slug: 'dacia-duster',
		name: 'Dacia Duster TCe 130',
		brand: 'Dacia',
		type: 'Kompakt-SUV',
		region: 'europe',
		warranty: 3,
		offers: [
			{ condition: 'used', price: 19900, mileage: 70000, color: 'grau', bodyType: 'suv', trunkSize: 472, drivetrain: 'combustion', power: 130, consumption: 6.2, co2: 141, seats: 5, features: ['climate', 'carplay', 'rearCam', 'awd'] }
		],
		description: 'Das günstigste SUV mit AWD — unschlagbares Preis-Leistungs-Verhältnis.',
		detailText: "AWD unter CHF 20'000 — kein anderes SUV bietet das. Robust, wartungsarm, 3 Jahre Garantie. Kein Schnickschnack, aber alles was man braucht. Ideal für Zweit- oder Nutzfahrzeug."
	},
	{
		slug: 'cupra-formentor',
		name: 'Cupra Formentor VZ',
		brand: 'Cupra',
		type: 'Kompakt-SUV',
		region: 'europe',
		warranty: 2,
		offers: [
			{ condition: 'new', price: 42900, color: 'schwarz', bodyType: 'suv', trunkSize: 420, drivetrain: 'combustion', power: 310, consumption: 7.4, co2: 168, seats: 5, features: ['climate', 'leather', 'carplay', 'navigation', 'rearCam', 'adaptiveCruise', 'laneAssist', 'sportSeats', 'awd', 'wirelessCharging'] }
		],
		description: '310 PS AWD — der Sport-SUV für Fahrspass ohne Kompromisse.',
		detailText: "310 PS, 0–100 in 4.9 Sekunden. Ledersportsitze und Navigation serienmässig. AWD für Traktion in jeder Situation. Wer Fahrspass über Effizienz stellt — das ist sein Auto."
	},
	{
		slug: 'suzuki-vitara-hybrid',
		name: 'Suzuki Vitara Hybrid',
		brand: 'Suzuki',
		type: 'Kompakt-SUV',
		region: 'asia',
		warranty: 3,
		offers: [
			{ condition: 'new', price: 25900, color: 'weiss', bodyType: 'suv', trunkSize: 375, drivetrain: 'hybrid', power: 129, consumption: 5.4, co2: 122, seats: 5, features: ['climate', 'carplay', 'rearCam', 'adaptiveCruise', 'awd'] }
		],
		description: 'Günstiger Hybrid-SUV mit AWD — ideal für Bergregionen.',
		detailText: "AWD und Hybrid unter CHF 26'000 — einzigartiges Angebot in dieser Preisklasse. Kompakt genug für die Stadt, robust genug fürs Gelände. 3 Jahre Garantie serienmässig."
	},
	{
		slug: 'bmw-ix1',
		name: 'BMW iX1 xDrive30',
		brand: 'BMW',
		type: 'Kompakt-SUV',
		region: 'europe',
		warranty: 2,
		offers: [
			{ condition: 'new', price: 54900, color: 'schwarz', bodyType: 'suv', trunkSize: 490, drivetrain: 'electric', power: 313, consumption: 17.6, co2: 0, seats: 5, features: ['climate', 'leather', 'carplay', 'navigation', 'surroundCam', 'adaptiveCruise', 'laneAssist', 'seatHeating', 'steeringWheelHeating', 'wirelessCharging', 'hud', 'awd'] }
		],
		description: '313 PS AWD elektrisch — BMW-Fahrgefühl ohne Emissionen.',
		detailText: "313 PS Allrad, 0–100 in 5.6 Sekunden. BMW-typisches Fahrgefühl, nun vollelektrisch. Vollausstattung ab Werk. Ca. CHF 60 Strom pro Monat. iDrive 8 mit grösstem Infotainment-Screen."
	},
	{
		slug: 'opel-mokka-e',
		name: 'Opel Mokka Electric',
		brand: 'Opel',
		type: 'Kompakt-SUV',
		region: 'europe',
		warranty: 3,
		offers: [
			{ condition: 'new', price: 33900, color: 'schwarz', bodyType: 'suv', trunkSize: 350, drivetrain: 'electric', power: 136, consumption: 16.2, co2: 0, seats: 5, features: ['climate', 'carplay', 'navigation', 'rearCam', 'parkAssist', 'laneAssist'] }
		],
		description: 'Kompakter E-SUV mit auffälligem Design zum fairen Preis.',
		detailText: "337 km Reichweite für den Alltag. Auffälligstes Design in dieser Preisklasse. 3 Jahre Garantie. Ideal als erstes Elektroauto — einfach, kompakt, unkompliziert."
	},
	{
		slug: 'mitsubishi-outlander-phev',
		name: 'Mitsubishi Outlander PHEV',
		brand: 'Mitsubishi',
		type: 'Mittelklasse-SUV',
		region: 'asia',
		warranty: 5,
		offers: [
			{ condition: 'new', price: 49900, color: 'schwarz', bodyType: 'van', trunkSize: 400, drivetrain: 'hybrid', power: 302, consumption: 2.0, co2: 46, seats: 7, features: ['climate', 'carplay', 'navigation', 'rearCam', 'adaptiveCruise', 'laneAssist', 'awd', 'seatHeating', 'electricTailgate', 'towHitch'] }
		],
		description: '7-Sitzer PHEV mit AWD — der Familien-SUV mit Stecker.',
		detailText: "Einziger 7-Sitzer PHEV mit AWD in dieser Preisklasse. Bis 87 km rein elektrisch. 302 PS Systemleistung. 5 Jahre Garantie. Ideal für grosse Familien mit Platzbedarf."
	},
	{
		slug: 'honda-jazz-crosstar',
		name: 'Honda Jazz Crosstar e:HEV',
		brand: 'Honda',
		type: 'Kleinwagen',
		region: 'asia',
		warranty: 5,
		offers: [
			{ condition: 'used', price: 27900, mileage: 30000, color: 'weiss', bodyType: 'kleinwagen', trunkSize: 298, drivetrain: 'hybrid', power: 109, consumption: 4.8, co2: 109, seats: 5, features: ['climate', 'carplay', 'rearCam', 'adaptiveCruise', 'laneAssist', 'parkAssist'] }
		],
		description: 'Clevere Raumnutzung, günstiger Hybrid — der smarte Stadtbegleiter.',
		detailText: "Magic-Seats: Rücksitze klappen flach bis zum Boden — ideal für Fahrräder und sperriges Gepäck. Vollhybrid ohne Stecker. 5 Jahre Garantie. Der pragmatischste Kleinwagen seiner Klasse."
	},
	{
		slug: 'peugeot-e-2008',
		name: 'Peugeot e-2008',
		brand: 'Peugeot',
		type: 'Kompakt-SUV',
		region: 'europe',
		warranty: 2,
		offers: [
			{ condition: 'new', price: 34900, color: 'weiss', bodyType: 'suv', trunkSize: 434, drivetrain: 'electric', power: 156, consumption: 16.4, co2: 0, seats: 5, features: ['climate', 'carplay', 'navigation', 'rearCam', 'laneAssist', 'parkAssist', 'hud'] }
		],
		description: 'Stilvoller E-SUV mit i-Cockpit und head-up Display.',
		detailText: "Head-up-Display serienmässig — einzigartig in dieser Preisklasse. 345 km Reichweite. Typisch französisches Design, das auffällt. Ideal für Stadt und Kurzstrecke."
	},
	{
		slug: 'mercedes-eqa',
		name: 'Mercedes EQA 250',
		brand: 'Mercedes',
		type: 'Kompakt-SUV',
		region: 'europe',
		warranty: 2,
		offers: [
			{ condition: 'new', price: 52900, color: 'schwarz', bodyType: 'suv', trunkSize: 340, drivetrain: 'electric', power: 190, consumption: 15.7, co2: 0, seats: 5, features: ['climate', 'leather', 'carplay', 'navigation', 'surroundCam', 'adaptiveCruise', 'laneAssist', 'seatHeating', 'wirelessCharging', 'parkAssist'] }
		],
		description: 'Mercedes-Qualität elektrisch — Einstieg ins Premium-E-Segment.',
		detailText: "Mercedes-typische Verarbeitung, nun vollelektrisch. MBUX Infotainment mit Sprachsteuerung. Leder und 360°-Kamera serienmässig. Hoher Restwert nach 4 Jahren — klassische Mercedes-Stärke."
	},
	{
		slug: 'audi-q4-etron',
		name: 'Audi Q4 e-tron',
		brand: 'Audi',
		type: 'Kompakt-SUV',
		region: 'europe',
		warranty: 2,
		offers: [
			{ condition: 'new', price: 49900, color: 'schwarz', bodyType: 'suv', trunkSize: 520, drivetrain: 'electric', power: 204, consumption: 16.9, co2: 0, seats: 5, features: ['climate', 'leather', 'carplay', 'navigation', 'rearCam', 'adaptiveCruise', 'laneAssist', 'seatHeating', 'wirelessCharging', 'hud', 'parkAssist'] }
		],
		description: 'Audis Elektro-SUV — grosses Head-up-Display, Premium-Feeling.',
		detailText: "Grösstes Head-up-Display aller Zeiten bei Audi — Projektion wie ein virtuelles 70-Zoll-TV. 520 L Kofferraum. Leder und Navigation serienmässig. Ca. CHF 60 Strom pro Monat."
	},
	{
		slug: 'seat-leon',
		name: 'Seat Leon FR TSI',
		brand: 'Seat',
		type: 'Kompaktwagen',
		region: 'europe',
		warranty: 2,
		offers: [
			{ condition: 'new', price: 27500, color: 'schwarz', bodyType: 'kompakt', trunkSize: 380, drivetrain: 'combustion', power: 150, consumption: 6.0, co2: 138, seats: 5, features: ['climate', 'carplay', 'rearCam', 'laneAssist', 'adaptiveCruise', 'sportSeats'] }
		],
		description: 'Sportlicher Kompakter mit FR-Ausstattung — Fahrspass zum Vernunftpreis.',
		detailText: "FR-Ausstattung mit Sportsitzen serienmässig. 150 PS für agiles Stadtfahren und Autobahn. Günstigste Möglichkeit, einen neuen Sportkompakten zu fahren. 2 Jahre Garantie."
	},
	{
		slug: 'bmw-m3',
		name: 'BMW M3 Competition',
		brand: 'BMW',
		type: 'Mittelklasse-Limousine',
		region: 'europe',
		warranty: 2,
		offers: [
			{ condition: 'new', price: 92900, color: 'schwarz', bodyType: 'limousine', trunkSize: 480, drivetrain: 'combustion', power: 510, consumption: 10.4, co2: 237, seats: 5, features: ['climate', 'leather', 'carplay', 'navigation', 'rearCam', 'adaptiveCruise', 'laneAssist', 'sportSeats', 'awd', 'hud', 'seatHeating'] }
		],
		description: '510 PS, 0–100 in 3.5 s — der Sportwagen im Alltagskleid.',
		detailText: '510 PS M xDrive Allrad, 0–100 km/h in 3.5 Sekunden. M Carbon Sportsitze und Carbon-Paket serienmässig. Auf der Rennstrecke zuhause, auf der Autobahn souverän. Das Benchmark-Sportauto seiner Klasse.'
	},
	{
		slug: 'audi-rs6-avant',
		name: 'Audi RS6 Avant',
		brand: 'Audi',
		type: 'Kombi',
		region: 'europe',
		warranty: 2,
		offers: [
			{ condition: 'new', price: 118900, color: 'schwarz', bodyType: 'kombi', trunkSize: 565, drivetrain: 'hybrid', power: 630, consumption: 11.2, co2: 214, seats: 5, features: ['climate', 'leather', 'carplay', 'navigation', 'surroundCam', 'adaptiveCruise', 'laneAssist', 'blindSpot', 'sportSeats', 'awd', 'hud', 'seatHeating', 'steeringWheelHeating', 'electricTailgate', 'wirelessCharging', 'roofRails'] }
		],
		description: '630 PS Kombi — der schnellste Familienwagen der Welt.',
		detailText: '630 PS mild-hybrid, 0–100 in 3.4 Sekunden bei 565 L Kofferraum. Wer Sportwagen-Performance und Alltags-Funktionalität verbinden will. Quattro AWD, Luftfederung serienmässig. Der Kombi, der keine Wünsche offen lässt.'
	},
	{
		slug: 'porsche-cayenne',
		name: 'Porsche Cayenne S',
		brand: 'Porsche',
		type: 'Mittelklasse-SUV',
		region: 'europe',
		warranty: 2,
		offers: [
			{ condition: 'new', price: 104900, color: 'schwarz', bodyType: 'suv', trunkSize: 772, drivetrain: 'combustion', power: 474, consumption: 11.9, co2: 270, seats: 5, features: ['climate', 'leather', 'carplay', 'navigation', 'surroundCam', 'adaptiveCruise', 'laneAssist', 'blindSpot', 'sportSeats', 'awd', 'hud', 'seatHeating', 'steeringWheelHeating', 'electricTailgate', 'panoramaRoof', 'wirelessCharging'] }
		],
		description: '474 PS SUV mit 772 L Kofferraum — Porsche für den Alltag.',
		detailText: '474 PS V8, 0–100 in 4.9 Sekunden. Gleichzeitig 772 L Kofferraum für die Familie. Porsche Traction Management AWD für jede Strasse. Der einzige SUV, der sich auf der Rennstrecke wie ein Sportwagen anfühlt.'
	},
	{
		slug: 'porsche-taycan',
		name: 'Porsche Taycan 4S',
		brand: 'Porsche',
		type: 'Mittelklasse-Limousine',
		region: 'europe',
		warranty: 4,
		offers: [
			{ condition: 'new', price: 112900, color: 'schwarz', bodyType: 'limousine', trunkSize: 366, drivetrain: 'electric', power: 571, consumption: 20.3, co2: 0, seats: 4, features: ['climate', 'leather', 'carplay', 'navigation', 'surroundCam', 'adaptiveCruise', 'laneAssist', 'blindSpot', 'sportSeats', 'awd', 'hud', 'seatHeating', 'steeringWheelHeating', 'wirelessCharging', 'parkAssist'] }
		],
		description: '571 PS elektrisch — Porsche-Fahrgefühl ohne Emissionen.',
		detailText: '571 PS AWD, 0–100 in 4.0 Sekunden. 800V-Architektur: 5–80 % in 22 Minuten am Schnelllader. Das erste Elektroauto, das sich wirklich wie ein Porsche anfühlt. 4 Jahre Garantie inklusive.'
	},
	{
		slug: 'mercedes-amg-c63',
		name: 'Mercedes-AMG C 63 S',
		brand: 'Mercedes',
		type: 'Mittelklasse-Limousine',
		region: 'europe',
		warranty: 2,
		offers: [
			{ condition: 'new', price: 97900, color: 'schwarz', bodyType: 'limousine', trunkSize: 455, drivetrain: 'hybrid', power: 680, consumption: 8.7, co2: 198, seats: 5, features: ['climate', 'leather', 'carplay', 'navigation', 'surroundCam', 'adaptiveCruise', 'laneAssist', 'blindSpot', 'sportSeats', 'hud', 'seatHeating', 'steeringWheelHeating', 'wirelessCharging', 'parkAssist'] }
		],
		description: '680 PS Plug-in-Hybrid — AMG-Brutalität mit Vernunft.',
		detailText: '680 PS Systemleistung (Vierzylinder + E-Motor), 0–100 in 3.4 Sekunden. Bis 13 km rein elektrisch — genug für die Innenstadt. AMG Performance-Abgasanlage serienmässig. Kraftvollster C-Klasse aller Zeiten.'
	},
	{
		slug: 'tesla-model-s-plaid',
		name: 'Tesla Model S Plaid',
		brand: 'Tesla',
		type: 'Mittelklasse-Limousine',
		region: 'america',
		warranty: 4,
		offers: [
			{ condition: 'new', price: 129900, color: 'weiss', bodyType: 'limousine', trunkSize: 793, drivetrain: 'electric', power: 1020, consumption: 18.4, co2: 0, seats: 5, features: ['climate', 'carplay', 'navigation', 'surroundCam', 'adaptiveCruise', 'laneAssist', 'sportSeats', 'hud', 'seatHeating', 'wirelessCharging', 'awd'] }
		],
		description: '1020 PS, 0–100 in 2.1 s — das schnellste Serienfahrzeug der Welt.',
		detailText: "1020 PS Tri-Motor AWD, 0–100 km/h in 2.1 Sekunden — schneller als jeder Supercar. 600 km Reichweite. Yoke-Lenkrad, 17-Zoll Touchscreen. Ca. CHF 70 Strom pro Monat bei 15'000 km."
	},
	{
		slug: 'citroen-ec4',
		name: 'Citroën ë-C4',
		brand: 'Citroën',
		type: 'Kompaktwagen',
		region: 'europe',
		warranty: 3,
		offers: [
			{ condition: 'new', price: 32900, color: 'weiss', bodyType: 'kompakt', trunkSize: 380, drivetrain: 'electric', power: 136, consumption: 16.1, co2: 0, seats: 5, features: ['climate', 'carplay', 'rearCam', 'laneAssist', 'parkAssist', 'adaptiveCruise'] }
		],
		description: 'Komfortabelster Elektro-Kompakter — Advanced Comfort-Federung.',
		detailText: "Beste Federung seiner Klasse — Citroëns Advanced Comfort schluckt Unebenheiten aussergewöhnlich gut. 350 km Reichweite. Kein Schnickschnack, dafür echten Fahrkomfort. 3 Jahre Garantie."
	}
];

export function getCarBySlug(slug: string): CarModel | undefined {
	return mockCars.find((c) => c.slug === slug);
}
