const theaters = [
  {
    attributes: {},
    relations: {
      translations: [{ name: 'Friedrichstadt-Palast', language: 'de' }],
      address: {
        street1: 'Friedrichstraße 107',
        zipCode: '10117',
        city: 'Berlin',
      },
    },
  },
  {
    attributes: { phone: '+49 30 27879030' },
    relations: {
      translations: [{ name: 'Quatsch Comedy Club', language: 'de' }],
      address: {
        street1: 'Friedrichstraße 107',
        zipCode: '10117',
        city: 'Berlin',
      },
    },
  },
  {
    attributes: {
      email: 'distel@distel-berlin.de',
      phone: '+49 30 203000-0',
    },
    relations: {
      translations: [{ name: 'Kabarett-Theater Distel', language: 'de' }],
      address: {
        street1: 'Friedrichstraße 101',
        zipCode: '10117',
        city: 'Berlin',
      },
    },
  },
  {
    attributes: { phone: '+49 30 47997499' },
    relations: {
      translations: [{ name: 'Admiralspalast', language: 'de' }],
      address: {
        street1: 'Friedrichstraße 101',
        zipCode: '10117',
        city: 'Berlin',
      },
    },
  },
  {
    attributes: {
      homepage: 'https://www.wuehlmaeuse.de/',
      phone: '+49 30 30673011',
    },
    relations: {
      translations: [{ name: 'Die Wühlmäuse', language: 'de' }],
      address: {
        street1: 'Pommernallee 2-4',
        zipCode: '14052',
        city: 'Berlin',
      },
    },
  },
  {
    attributes: {
      email: 'info@hebbel-am-ufer.de',
      phone: '+49 30 259004-27',
    },
    relations: {
      translations: [{ name: 'HAU 2 (Hebbel am Ufer)', language: 'de' }],
      address: {
        street1: 'Hallesches Ufer 32',
        zipCode: '10963',
        city: 'Berlin',
      },
    },
  },
  {
    attributes: {
      email: 'info@sophiensaele.com',
      homepage: 'http://www.sophiensaele.com/',
      phone: '+49 30 2825266',
    },
    relations: {
      translations: [{ name: 'Sophiensæle', language: 'de' }],
      address: {
        street1: 'Sophienstraße 18',
        zipCode: '10178',
        city: 'Berlin',
      },
    },
  },
  {
    attributes: {
      email: 'info@kriminaltheater.de',
      homepage: 'http://www.kriminaltheater.de/',
      phone: '+49 30 47997488',
    },
    relations: {
      translations: [{ name: 'Berliner Kriminaltheater', language: 'de' }],
      address: {
        street1: 'Palisadenstraße 48',
        zipCode: '10243',
        city: 'Berlin',
      },
    },
  },
  {
    attributes: {},
    relations: {
      translations: [{ name: 'Schaubühne am Lehniner Platz', language: 'de' }],
      address: {
        street1: 'Kurfürstendamm 153',
        zipCode: '10709',
        city: 'Berlin',
      },
    },
  },
  {
    attributes: {
      email: 'ratibortheater@t-online.de',
      homepage: 'http://www.ratibortheater.de/',
      phone: '+49 30 6186199',
    },
    relations: {
      translations: [{ name: 'Ratibortheater', language: 'de' }],
      address: {
        street1: 'Cuvrystraße 20a',
        zipCode: '10997',
        city: 'Berlin',
      },
    },
  },
  {
    attributes: {},
    relations: {
      translations: [{ name: 'Verlängertes Wohnzimmer', language: 'de' }],
      address: {
        street1: 'Frankfurter Allee 91',
        zipCode: '10247',
        city: 'Berlin',
      },
    },
  },
  {
    attributes: {},
    relations: {
      translations: [
        { name: 'Deutsche Oper Berlin', language: 'de' },
        { name: 'German Opera Berlin', language: 'en' },
      ],
      address: {
        street1: 'Bismarckstraße 35',
        zipCode: '10627',
        city: 'Berlin',
      },
    },
  },
  {
    attributes: {
      email: 'info@parkaue.de',
      homepage: 'http://www.parkaue.de',
      phone: '+49 30 557752-0',
    },
    relations: {
      translations: [{ name: 'Theater an der Parkaue', language: 'de' }],
      address: {
        street1: 'Parkaue 29',
        zipCode: '10367',
        city: 'Berlin',
      },
    },
  },
  {
    attributes: { email: 'mail@thikwa.de', phone: '+49 30 6146467' },
    relations: {
      translations: [{ name: 'Theater Thikwa (F40)', language: 'de' }],
      address: {
        street1: 'Fidicinstraße 40',
        zipCode: '10965',
        city: 'Berlin',
      },
    },
  },
  {
    attributes: { phone: '+49 30 202 600' },
    relations: {
      translations: [{ name: 'Komische Oper Berlin', language: 'de' }],
      address: {
        street1: 'Behrenstraße 55-57',
        zipCode: '10117',
        city: 'Berlin',
      },
    },
  },
  {
    attributes: {},
    relations: {
      translations: [{ name: 'Deutsches Theater', language: 'de' }],
      address: {
        street1: 'Schumannstraße 13a',
        zipCode: '10117',
        city: 'Berlin',
      },
    },
  },
  {
    attributes: {},
    relations: {
      translations: [{ name: 'Kleines Theater', language: 'de' }],
      address: {
        street1: 'Südwestkorso 64',
        zipCode: '12161',
        city: 'Berlin',
      },
    },
  },
  {
    attributes: {
      email: 'info@neukoellneroper.de',
      phone: '+49 30 688907-77',
    },
    relations: {
      translations: [{ name: 'Neuköllner Oper', language: 'de' }],
      address: {
        street1: 'Karl-Marx-Straße 131-133',
        zipCode: '12043',
        city: 'Berlin',
      },
    },
  },
  {
    attributes: { phone: '+49-30 24065777' },
    relations: {
      translations: [{ name: 'Volksbühne im Prater', language: 'de' }],
      address: {
        street1: 'Kastanienallee 7-9',
        zipCode: '10435',
        city: 'Berlin',
      },
    },
  },
  {
    attributes: { phone: '+49 30 2010693' },
    relations: {
      translations: [{ name: 'Theater im Palais', language: 'de' }],
      address: {
        street1: 'Am Festungsgraben 1',
        zipCode: '10117',
        city: 'Berlin',
      },
    },
  },
  {
    attributes: {
      email: 'info@vaganten.de',
      homepage: 'http://www.vaganten.de/',
      phone: '+49-30-3124529',
    },
    relations: {
      translations: [{ name: 'Vaganten Bühne', language: 'de' }],
      address: {
        street1: 'Kantstraße 12a',
        zipCode: '10623',
        city: 'Berlin',
      },
    },
  },
  {
    attributes: {
      homepage: 'http://www.mirakulum.de',
      phone: '+49304490820',
    },
    relations: {
      translations: [
        { name: 'Mirakulum Puppenkomödie Berlin', language: 'de' },
      ],
      address: {
        street1: 'Brunnenstraße 35',
        zipCode: '10115',
        city: 'Berlin',
      },
    },
  },
  {
    attributes: {
      email: 'info@chamaeleonberlin.com',
      homepage: 'http://www.chamaeleonberlin.com',
      phone: '+49 30 400059-0',
    },
    relations: {
      translations: [{ name: 'Chamäleon', language: 'de' }],
      address: {
        street1: 'Rosenthaler Straße 40-41',
        zipCode: '10178',
        city: 'Berlin',
      },
    },
  },
  {
    attributes: {
      email: 'tickets@renaissance-theater.de',
      homepage: 'http://www.renaissance-theater.de/',
      phone: '+49-30-3124202',
    },
    relations: {
      translations: [{ name: 'Renaissance-Theater Berlin', language: 'de' }],
      address: {
        street1: 'Knesebeckstraße 100',
        zipCode: '10623',
        city: 'Berlin',
      },
    },
  },
  {
    attributes: {},
    relations: {
      translations: [{ name: 'Theater Coupé', language: 'de' }],
      address: {
        street1: 'Hohenzollerndamm 177',
        zipCode: '10713',
        city: 'Berlin',
      },
    },
  },
  {
    attributes: {
      email: 'info@bka-theater.de',
      phone: '+49 30 202200-7',
    },
    relations: {
      translations: [{ name: 'BKA-Theater', language: 'de' }],
      address: {
        street1: 'Mehringdamm 34',
        zipCode: '10961',
        city: 'Berlin',
      },
    },
  },
  {
    attributes: {
      homepage: 'http://www.puppentheater-firlefanz.de/',
      phone: '+49302833560',
    },
    relations: {
      translations: [{ name: 'Puppentheater Firlefanz', language: 'de' }],
      address: {
        street1: 'Sophienstraße 10',
        zipCode: '10178',
        city: 'Berlin',
      },
    },
  },
  {
    attributes: {
      homepage: 'http://www.ballhausnaunynstrasse.de/',
      phone: '+49 30 75453725',
    },
    relations: {
      translations: [{ name: 'Ballhaus Naunynstraße', language: 'de' }],
      address: {
        street1: 'Naunynstraße 27',
        zipCode: '10997',
        city: 'Berlin',
      },
    },
  },
  {
    attributes: {},
    relations: {
      translations: [{ name: 'AHA-Berlin e.V.', language: 'de' }],
      address: {
        street1: 'Monumentenstraße 13',
        zipCode: '10829',
        city: 'Berlin',
      },
    },
  },
  {
    attributes: { phone: '+49 30 56821333' },
    relations: {
      translations: [{ name: 'Heimathafen Neukölln', language: 'de' }],
      address: {
        street1: 'Karl-Marx-Straße 141',
        zipCode: '12043',
        city: 'Berlin',
      },
    },
  },
  {
    attributes: {
      email: 'info@diestachelschweine.de',
      homepage: 'http://www.diestachelschweine.de/',
      phone: '+49-30-2615795',
    },
    relations: {
      translations: [{ name: 'Die Stachelschweine', language: 'de' }],
      address: {
        street1: 'Tauentzienstraße 9-12',
        zipCode: '10789',
        city: 'Berlin',
      },
    },
  },
  {
    attributes: {
      email: 'info@theater-lichterfelde.de',
      phone: '+49 30 84314646',
    },
    relations: {
      translations: [{ name: 'Theater Lichterfelde', language: 'de' }],
      address: {
        street1: 'Drakestraße 49',
        zipCode: '12205',
        city: 'Berlin',
      },
    },
  },
  {
    attributes: {
      email: 'box@hauptstadtoper.de',
      homepage: 'http://www.hauptstadtoper.de/',
      phone: '+49 30 36444467',
    },
    relations: {
      translations: [{ name: 'Hauptstadtoper', language: 'de' }],
      address: {
        street1: 'Landsberger Allee 61',
        zipCode: '10249',
        city: 'Berlin',
      },
    },
  },
  {
    attributes: { email: 'mehringhof@ipn.de', phone: '+49 30 6918021' },
    relations: {
      translations: [{ name: 'Mehringhof Theater', language: 'de' }],
      address: {
        street1: 'Gneisenaustraße 2a',
        zipCode: '10961',
        city: 'Berlin',
      },
    },
  },
  {
    attributes: {
      homepage: 'http://www.zimmertheater-steglitz.de/',
      phone: '+49 30 25058078',
    },
    relations: {
      translations: [{ name: 'Zimmertheater Steglitz', language: 'de' }],
      address: {
        street1: 'Bornstraße 17',
        zipCode: '12163',
        city: 'Berlin',
      },
    },
  },
  {
    attributes: { phone: '+49 30 47997474' },
    relations: {
      translations: [{ name: 'Ballhaus Ost', language: 'de' }],
      address: {
        street1: 'Pappelallee 15',
        zipCode: '10437',
        city: 'Berlin',
      },
    },
  },
  {
    attributes: {},
    relations: {
      translations: [{ name: 'Zauberlounge', language: 'de' }],
      address: {
        street1: 'Horstweg 3',
        zipCode: '14059',
        city: 'Berlin',
      },
    },
  },
  {
    attributes: { email: 'tickets@etberlin.de', phone: '+49 30 6911211' },
    relations: {
      translations: [{ name: 'F40 - English Theatre Berlin', language: 'de' }],
      address: {
        street1: 'Fidicinstraße 40',
        zipCode: '10965',
        city: 'Berlin',
      },
    },
  },
  {
    attributes: {
      email: 'pupp@das-weite-theater.de',
      homepage: 'http://www.das-weite-theater.de/',
      phone: '+49 30 9917927',
    },
    relations: {
      translations: [{ name: 'Das weite Theater', language: 'de' }],
      address: {
        street1: 'Parkaue 23',
        zipCode: '10367',
        city: 'Berlin',
      },
    },
  },
  {
    attributes: {
      email: 'theater@niva.de',
      homepage: 'http://www.theater-der-kleinen-form.de',
      phone: '+49 30 293 50 461',
    },
    relations: {
      translations: [{ name: 'Theater der kleinen Form', language: 'de' }],
      address: {
        street1: 'Gubener Straße 45',
        zipCode: '10243',
        city: 'Berlin',
      },
    },
  },
  {
    attributes: { phone: '+49 30 37447808' },
    relations: {
      translations: [{ name: 'Theater O-TonArt', language: 'de' }],
      address: {
        street1: 'Kulmer Straße 20a',
        zipCode: '10783',
        city: 'Berlin',
      },
    },
  },
  {
    attributes: {
      email: 'info@theater-on.de',
      homepage: 'https://www.theater-on.de/',
      phone: '+49 30 4409214',
    },
    relations: {
      translations: [{ name: 'Theater o.N.', language: 'de' }],
      address: {
        street1: 'Kollwitzstraße 53',
        zipCode: '10405',
        city: 'Berlin',
      },
    },
  },
  {
    attributes: {
      email: 'karten@bat-berlin.de',
      phone: '+49 30 755417-777',
    },
    relations: {
      translations: [{ name: 'bat-Studiotheater', language: 'de' }],
      address: {
        street1: 'Belforter Straße 15',
        zipCode: '10405',
        city: 'Berlin',
      },
    },
  },
  {
    attributes: {
      email: 'info@hebbel-am-ufer.de',
      homepage: 'http://www.hebbel-am-ufer.de/',
      phone: '+49 30 25900427',
    },
    relations: {
      translations: [{ name: 'HAU 3 (Hebbel am Ufer)', language: 'de' }],
      address: {
        street1: 'Tempelhofer Ufer 10',
        zipCode: '10963',
        city: 'Berlin',
      },
    },
  },
  {
    attributes: {
      email: 'unitheater@gmail.com',
      homepage: 'http://www.udk-berlin.de/sites/unit/',
      phone: '+49 30 3185-2678',
    },
    relations: {
      translations: [
        { name: 'UNI.T - Theater der UdK Berlin', language: 'de' },
      ],
      address: {
        street1: 'Fasanenstraße 1b',
        zipCode: '10623',
        city: 'Berlin',
      },
    },
  },
  {
    attributes: {
      email: 'zimmertheater.kultschule@gmx.de',
      homepage: 'http://www.zimmertheater-karlshorst.de/',
      phone: '+49 30 5534616',
    },
    relations: {
      translations: [{ name: 'Zimmertheater Kultschule', language: 'de' }],
      address: {
        street1: 'Sewanstraße 43',
        zipCode: '10319',
        city: 'Berlin',
      },
    },
  },
  {
    attributes: {},
    relations: {
      translations: [{ name: 'Prime Time Theater', language: 'de' }],
      address: {
        street1: 'Müllerstraße 163',
        zipCode: '13353',
        city: 'Berlin',
      },
    },
  },
  {
    attributes: {},
    relations: {
      translations: [{ name: 'Theater im Keller', language: 'de' }],
      address: {
        street1: 'Weserstraße 211',
        zipCode: '12047',
        city: 'Berlin',
      },
    },
  },
  {
    attributes: {},
    relations: {
      translations: [
        { name: 'Stage Theater am Potsdamer Platz', language: 'de' },
      ],
      address: {
        street1: 'Marlene-Dietrich-Platz 1',
        zipCode: '10785',
        city: 'Berlin',
      },
    },
  },
  {
    attributes: {
      email: 'service@deutschestheater.de',
      phone: '+49 30 28441-221',
    },
    relations: {
      translations: [{ name: 'Kammerspiele', language: 'de' }],
      address: {
        street1: 'Schumannstraße 13a',
        zipCode: '10117',
        city: 'Berlin',
      },
    },
  },
  {
    attributes: { email: 'ticket@gorki.de', phone: '+49 30 20221-115' },
    relations: {
      translations: [
        { name: 'Maxim-Gorki-Theater', language: 'de' },
        { name: 'Maxim Gorky Theatre', language: 'en' },
      ],
      address: {
        street1: 'Am Festungsgraben 2',
        zipCode: '10117',
        city: 'Berlin',
      },
    },
  },
  {
    attributes: { phone: '+493044673264' },
    relations: {
      translations: [{ name: 'BühnenRausch', language: 'de' }],
      address: {
        street1: 'Erich-Weinert-Straße 27',
        zipCode: '10439',
        city: 'Berlin',
      },
    },
  },
  {
    attributes: {},
    relations: {
      translations: [{ name: 'Kleine Nachtrevue', language: 'de' }],
      address: {
        street1: 'Kurfürstenstraße 116',
        zipCode: '10787',
        city: 'Berlin',
      },
    },
  },
  {
    attributes: {},
    relations: {
      translations: [{ name: 'Tempodrom', language: 'de' }],
      address: {
        street1: 'Möckernstraße 10',
        zipCode: '10963',
        city: 'Berlin',
      },
    },
  },
  {
    attributes: {
      homepage: 'http://www.comedyclub.de/berlin/start.php',
      phone: '+4930 48623186',
    },
    relations: {
      translations: [{ name: 'Kookaburra Comedy Club', language: 'de' }],
      address: {
        street1: 'Schönhauser Allee 184',
        zipCode: '10119',
        city: 'Berlin',
      },
    },
  },
  {
    attributes: { homepage: 'http://www.freietheateranstalten.de' },
    relations: {
      translations: [{ name: 'Freie Theateranstalten Berlin', language: 'de' }],
      address: {
        street1: 'Klausenerplatz 19',
        zipCode: '14059',
        city: 'Berlin',
      },
    },
  },
  {
    attributes: {},
    relations: {
      translations: [{ name: 'Fabriktheater', language: 'de' }],
      address: {
        street1: 'Lehrter Straße 35',
        zipCode: '10557',
        city: 'Berlin',
      },
    },
  },
  {
    attributes: {},
    relations: {
      translations: [{ name: 'Garn Theater', language: 'de' }],
      address: {
        street1: 'Katzbachstraße 19',
        zipCode: '10965',
        city: 'Berlin',
      },
    },
  },
  {
    attributes: {
      homepage: 'http://www.volksbuehne-berlin.de/',
      phone: '+49 30 24065777',
    },
    relations: {
      translations: [
        { name: 'Volksbühne am Rosa-Luxemburg-Platz', language: 'de' },
      ],
      address: {
        street1: 'Linienstraße 227',
        zipCode: '10178',
        city: 'Berlin',
      },
    },
  },
  {
    attributes: {},
    relations: {
      translations: [{ name: 'Keller', language: 'de' }],
      address: {
        street1: 'Karl-Marx-Straße 58',
        zipCode: '12043',
        city: 'Berlin',
      },
    },
  },
  {
    attributes: { email: 'info@schaubude-berlin.de' },
    relations: {
      translations: [{ name: 'Schaubude Berlin', language: 'de' }],
      address: {
        street1: 'Greifswalder Straße 81-84',
        zipCode: '10405',
        city: 'Berlin',
      },
    },
  },
  {
    attributes: {},
    relations: {
      translations: [{ name: 'Theater Nikolassee', language: 'de' }],
      address: {
        street1: 'Kirchweg 6',
        zipCode: '14129',
        city: 'Berlin',
      },
    },
  },
  {
    attributes: {},
    relations: {
      translations: [{ name: 'Prenzlkasper', language: 'de' }],
      address: {
        street1: 'Marienburger Straße 38',
        zipCode: '10405',
        city: 'Berlin',
      },
    },
  },
  {
    attributes: {},
    relations: {
      translations: [{ name: 'Kulturversteck Tegel', language: 'de' }],
      address: {
        street1: 'Schloßstraße 9',
        zipCode: '13507',
        city: 'Berlin',
      },
    },
  },
  {
    attributes: {},
    relations: {
      translations: [
        { name: 'Sternberg - Theater in der Spielbank', language: 'de' },
      ],
      address: {
        street1: 'Marlene-Dietrich-Platz 1',
        zipCode: '10785',
        city: 'Berlin',
      },
    },
  },
  {
    attributes: { homepage: 'https://www.puppentheater-berlin.de/' },
    relations: {
      translations: [{ name: 'Puppentheater Berlin', language: 'de' }],
      address: {
        street1: 'Gierkeplatz 2',
        zipCode: '10585',
        city: 'Berlin',
      },
    },
  },
  {
    attributes: {},
    relations: {
      translations: [{ name: 'Puppentheater Felicio', language: 'de' }],
      address: {
        street1: 'Schivelbeiner Straße 45',
        zipCode: '10439',
        city: 'Berlin',
      },
    },
  },
  {
    attributes: {},
    relations: {
      translations: [{ name: 'Zaubertheater Igor Jedlin', language: 'de' }],
      address: {
        street1: 'Roscherstraße 7',
        zipCode: '10629',
        city: 'Berlin',
      },
    },
  },
  {
    attributes: { phone: '+49 30 81863695' },
    relations: {
      translations: [{ name: 'Spiegelsalon', language: 'de' }],
      address: {
        street1: 'Friedbergstraße 29',
        zipCode: '14057',
        city: 'Berlin',
      },
    },
  },
  {
    attributes: {
      email: 'kkwm@ida-nowhere.com',
      homepage: 'http://www.ida-nowhere.com',
      phone: '+49 163 4921813',
    },
    relations: {
      translations: [{ name: 'Ida Nowhere', language: 'de' }],
      address: {
        street1: 'Donaustraße 79',
        zipCode: '12043',
        city: 'Berlin',
      },
    },
  },
  {
    attributes: {},
    relations: {
      translations: [{ name: 'Wintergarten Varieté', language: 'de' }],
      address: {
        street1: 'Potsdamer Straße 96',
        zipCode: '10785',
        city: 'Berlin',
      },
    },
  },
  {
    attributes: {},
    relations: {
      translations: [{ name: 'Pfefferberg Theater', language: 'de' }],
      address: {
        street1: 'Schönhauser Allee 175',
        zipCode: '10119',
        city: 'Berlin',
      },
    },
  },
  {
    attributes: {},
    relations: {
      translations: [{ name: 'Fliegendes Theater', language: 'de' }],
      address: {
        street1: 'Urbanstraße 100',
        zipCode: '10967',
        city: 'Berlin',
      },
    },
  },
  {
    attributes: {},
    relations: {
      translations: [{ name: 'Zebrano-Theater', language: 'de' }],
      address: {
        street1: 'Sonntagstraße 8',
        zipCode: '10245',
        city: 'Berlin',
      },
    },
  },
  {
    attributes: {},
    relations: {
      translations: [{ name: 'Die Etage', language: 'de' }],
      address: {
        street1: 'Ritterstraße 12-14',
        zipCode: '10969',
        city: 'Berlin',
      },
    },
  },
  {
    attributes: {},
    relations: {
      translations: [
        { name: 'Ehemaliges Stummfilmkino Delphi', language: 'de' },
      ],
      address: {
        street1: 'Gustav-Adolf-Straße 2',
        zipCode: '13086',
        city: 'Berlin',
      },
    },
  },
  {
    attributes: {},
    relations: {
      translations: [{ name: 'Galli Theater Berlin', language: 'de' }],
      address: {
        street1: 'Oranienburger Straße 32',
        zipCode: '10117',
        city: 'Berlin',
      },
    },
  },
  {
    attributes: {},
    relations: {
      translations: [{ name: 'Pierre Boulez Saal', language: 'de' }],
      address: {
        street1: 'Französische Straße 33d',
        zipCode: '10117',
        city: 'Berlin',
      },
    },
  },
  {
    attributes: {},
    relations: {
      translations: [{ name: 'Theater BOKA', language: 'de' }],
      address: {
        street1: 'Wollankstraße 112',
        zipCode: '13187',
        city: 'Berlin',
      },
    },
  },
  {
    attributes: {},
    relations: {
      translations: [{ name: 'Zirkus Zack', language: 'de' }],
      address: { street1: 'Revaler Straße 99' },
    },
  },
  {
    attributes: {},
    relations: {
      translations: [{ name: 'Jaro Theater', language: 'de' }],
      address: { street1: 'Schlangenbader Straße 30' },
    },
  },
  {
    attributes: {},
    relations: {
      translations: [{ name: 'Piano Salon Christophori', language: 'de' }],
      address: {
        street1: 'Uferstraße 8',
        zipCode: '13357',
        city: 'Berlin',
      },
    },
  },
  {
    attributes: {},
    relations: {
      translations: [{ name: 'Theaterdiscounter', language: 'de' }],
      address: {
        street1: 'Klosterstraße 44',
        zipCode: '10179',
        city: 'Berlin',
      },
    },
  },
  {
    attributes: {},
    relations: {
      translations: [{ name: 'Verti Music Hall', language: 'de' }],
      address: {
        street1: 'Mercedes-Platz 1',
        zipCode: '10243',
        city: 'Berlin',
      },
    },
  },
  {
    attributes: {},
    relations: {
      translations: [{ name: 'Freiraum - Veranstaltungssaal', language: 'de' }],
      address: {
        street1: 'Hardenbergstraße 35',
        zipCode: '10623',
        city: 'Berlin',
      },
    },
  },
  {
    attributes: {},
    relations: {
      translations: [{ name: 'Schlossplatztheater', language: 'de' }],
      address: {
        street1: 'Alt-Köpenick 31',
        zipCode: '12555',
        city: 'Berlin',
      },
    },
  },
  {
    attributes: {},
    relations: {
      translations: [{ name: 'Theater X', language: 'de' }],
      address: {
        street1: 'Wiclefstraße 32',
        zipCode: '10551',
        city: 'Berlin',
      },
    },
  },
  {
    attributes: {},
    relations: {
      translations: [{ name: 'Stage Bluemax Theater', language: 'de' }],
      address: {
        street1: 'Marlene-Dietrich-Platz 4',
        zipCode: '10785',
        city: 'Berlin',
      },
    },
  },
  {
    attributes: { homepage: 'http://kulturbremse.mo-po.net/' },
    relations: {
      translations: [{ name: 'Kulturbremse', language: 'de' }],
      address: {
        street1: 'Jagowstraße 29',
        zipCode: '10555',
        city: 'Berlin',
      },
    },
  },
  {
    attributes: {},
    relations: {
      translations: [{ name: 'Kammermusiksaal Friedenau', language: 'de' }],
      address: {
        street1: 'Isoldestraße 9',
        zipCode: '12159',
        city: 'Berlin',
      },
    },
  },
  {
    attributes: {
      homepage: 'https://www.acud-theater.de/',
      phone: '+49 30 44359497',
    },
    relations: {
      translations: [{ name: 'ACUD Theater', language: 'de' }],
      address: {
        street1: 'Veteranenstraße 21',
        zipCode: '10119',
        city: 'Berlin',
      },
    },
  },
  {
    attributes: {},
    relations: {
      translations: [{ name: 'Waldbühne', language: 'de' }],
      address: {
        street1: 'Am Glockenturm 1',
        zipCode: '14053',
        city: 'Berlin',
      },
    },
  },
  {
    attributes: {},
    relations: {
      translations: [
        { name: 'Staatsoper Unter den Linden', language: 'de' },
        { name: 'Berlin State Opera', language: 'en' },
      ],
      address: {
        street1: 'Unter den Linden 7',
        zipCode: '10117',
        city: 'Berlin',
      },
    },
  },
  {
    attributes: {
      email: 'theateruntermdach@gmx.de',
      phone: '+49 30 902953817',
    },
    relations: {
      translations: [{ name: 'Theater unterm Dach', language: 'de' }],
      address: {
        street1: 'Danziger Straße 103',
        zipCode: '10405',
        city: 'Berlin',
      },
    },
  },
  {
    attributes: {
      email: 'info@tbhm.de',
      homepage: 'http://www.theaterhaus.berlin',
      phone: '+493 0 280419-66',
    },
    relations: {
      translations: [{ name: 'Theaterhaus Berlin-Mitte', language: 'de' }],
      address: {
        street1: 'Wallstraße 32',
        zipCode: '10179',
        city: 'Berlin',
      },
    },
  },
  {
    attributes: {
      homepage: 'http://www.marameo.de',
      phone: '+49 30 2823455',
    },
    relations: {
      translations: [{ name: 'Tanzprobebühne Marameo e.V.', language: 'de' }],
      address: {
        street1: 'Wallstraße 32',
        zipCode: '10179',
        city: 'Berlin',
      },
    },
  },
  {
    attributes: { homepage: 'https://cabuwazi.de/' },
    relations: {
      translations: [{ name: 'Cabuwazi', language: 'de' }],
      address: {
        street1: 'Otto-Rosenberg-Straße 2',
        zipCode: '12681',
        city: 'Berlin',
      },
    },
  },
  {
    attributes: {
      homepage: 'http://www.atzeberlin.de/',
      phone: '+49 30 81799188',
    },
    relations: {
      translations: [{ name: 'Atze Musiktheater', language: 'de' }],
      address: {
        street1: 'Luxemburger Straße 20',
        zipCode: '13353',
        city: 'Berlin',
      },
    },
  },
  {
    attributes: {
      email: 'info@grips-theater.de',
      homepage: 'http://www.grips-theater.de',
      phone: '+49 30 397474-0',
    },
    relations: {
      translations: [{ name: 'GRIPS Theater', language: 'de' }],
      address: {
        street1: 'Altonaer Straße 22',
        zipCode: '10557',
        city: 'Berlin',
      },
    },
  },
  {
    attributes: {},
    relations: {
      translations: [{ name: 'Haus der Berliner Festspiele', language: 'de' }],
      address: {
        street1: 'Schaperstraße 24',
        zipCode: '10719',
        city: 'Berlin',
      },
    },
  },
  {
    attributes: {},
    relations: {
      translations: [{ name: 'Bar jeder Vernunft', language: 'de' }],
      address: {
        street1: 'Schaperstraße 24',
        zipCode: '10719',
        city: 'Berlin',
      },
    },
  },
  {
    attributes: {},
    relations: {
      translations: [{ name: 'Schlosspark Theater', language: 'de' }],
      address: {
        street1: 'Schloßstraße 48',
        zipCode: '12165',
        city: 'Berlin',
      },
    },
  },
  {
    attributes: {},
    relations: {
      translations: [{ name: 'Figurentheater Grashüpfer', language: 'de' }],
      address: {
        street1: 'Puschkinallee 16a',
        zipCode: '12435',
        city: 'Berlin',
      },
    },
  },
  {
    attributes: {},
    relations: {
      translations: [
        { name: 'MEINE BÜHNE Kinder & JugendTheater', language: 'de' },
      ],
      address: {
        street1: 'Boxhagener Straße 99',
        zipCode: '10245',
        city: 'Berlin',
      },
    },
  },
  {
    attributes: {},
    relations: {
      translations: [{ name: 'Kindl-Bühne Wuhlheide', language: 'de' }],
      address: {
        street1: 'Straße zum FEZ 4',
        zipCode: '12459',
        city: 'Berlin',
      },
    },
  },
  {
    attributes: { homepage: 'http://www.theater-des-westens.de/' },
    relations: {
      translations: [{ name: 'Stage Theater des Westens', language: 'de' }],
      address: {
        street1: 'Kantstraße 12',
        zipCode: '10623',
        city: 'Berlin',
      },
    },
  },
  {
    attributes: { phone: '+49 30 92124150' },
    relations: {
      translations: [
        { name: 'FELD Theater für junges Publikum', language: 'de' },
      ],
      address: {
        street1: 'Gleditschstraße 5',
        zipCode: '10781',
        city: 'Berlin',
      },
    },
  },
  {
    attributes: {
      email: 'info@hebbel-am-ufer.de',
      phone: '+49 30 259004-27',
    },
    relations: {
      translations: [{ name: 'HAU 1 (Hebbel am Ufer)', language: 'de' }],
      address: {
        street1: 'Stresemannstraße 29',
        zipCode: '10963',
        city: 'Berlin',
      },
    },
  },
  {
    attributes: {
      email: 'info@stadttheatercoepenick.de',
      homepage: 'http://www.stadttheatercoepenick.de/',
      phone: '+49 30 65016234',
    },
    relations: {
      translations: [{ name: 'Stadttheater Cöpenick', language: 'de' }],
      address: {
        street1: 'Friedrichshagener Straße 9',
        zipCode: '12555',
        city: 'Berlin',
      },
    },
  },
  {
    attributes: {
      homepage: 'http://www.tiyatrom.de',
      phone: '+49 30 6152020',
    },
    relations: {
      translations: [{ name: 'Tiyatrom', language: 'de' }],
      address: {
        street1: 'Alte Jakobstraße 12',
        zipCode: '10969',
        city: 'Berlin',
      },
    },
  },
  {
    attributes: {
      email: 'info@heinrich-zille-darsteller.de',
      homepage:
        'https://sites.google.com/site/heinrichzilledarsteller/das-zille-theater',
      phone: '+49 30 66309318',
    },
    relations: {
      translations: [{ name: 'Zilles Stubentheater', language: 'de' }],
      address: {
        street1: 'Jägerstraße 4',
        zipCode: '12555',
        city: 'Berlin',
      },
    },
  },
  {
    attributes: {},
    relations: {
      translations: [{ name: 'Glaskasten', language: 'de' }],
      address: {
        street1: 'Prinzenallee 33',
        zipCode: '13359',
        city: 'Berlin',
      },
    },
  },
  {
    attributes: {},
    relations: {
      translations: [{ name: 'Kinder-Zirkus Cabuwazi', language: 'de' }],
      address: {
        street1: 'Venusstraße 90',
        zipCode: '12524',
        city: 'Berlin',
      },
    },
  },
  {
    attributes: {
      email: 'info@schalotte.de',
      homepage: 'http://www.schalotte.de/',
      phone: '+49 30 3411485',
    },
    relations: {
      translations: [{ name: 'Café Theater Schalotte', language: 'de' }],
      address: {
        street1: 'Behaimstraße 22',
        zipCode: '10585',
        city: 'Berlin',
      },
    },
  },
  {
    attributes: {
      email: 'ticket@konzerthaus.de',
      phone: '+49 30 20309-2101',
    },
    relations: {
      translations: [{ name: 'Konzerthaus Berlin', language: 'de' }],
      address: {
        street1: 'Gendarmenmarkt 3',
        zipCode: '10117',
        city: 'Berlin',
      },
    },
  },
  {
    attributes: {},
    relations: {
      translations: [{ name: 'Schillertheater', language: 'de' }],
      address: {
        street1: 'Bismarckstraße 110',
        zipCode: '10625',
        city: 'Berlin',
      },
    },
  },
  {
    attributes: { phone: '+493028408153' },
    relations: {
      translations: [{ name: 'Berliner Ensemble', language: 'de' }],
      address: {
        street1: 'Bertolt-Brecht-Platz 1',
        zipCode: '10117',
        city: 'Berlin',
      },
    },
  },
  {
    attributes: {},
    relations: {
      translations: [{ name: 'Biesdorfer Parkbühne', language: 'de' }],
      address: {
        street1: 'Nordpromenade 5',
        zipCode: '12683',
        city: 'Berlin',
      },
    },
  },
  {
    attributes: { email: 'ylva.queisser@cabuwazi.de' },
    relations: {
      translations: [
        {
          name:
            'Kinder- und Jugendzirkus Cabuwazi Tempelhof - Der Kulturflughafen',
          language: 'de',
        },
      ],
      address: {
        street1: 'Columbiadamm 84',
        zipCode: '10965',
        city: 'Berlin',
      },
    },
  },
  {
    attributes: {
      email: 'buero.treptow@cabuwazi.de',
      homepage: 'https://cabuwazi.de/',
      phone: '+49 30 60969563',
    },
    relations: {
      translations: [{ name: 'Cabuwazi', language: 'de' }],
      address: {
        street1: 'Bouchéstraße 74',
        zipCode: '12435',
        city: 'Berlin',
      },
    },
  },
  {
    attributes: {},
    relations: {
      translations: [{ name: 'Theater am Park', language: 'de' }],
      address: {
        street1: 'Frankenholzer Weg 4',
        zipCode: '12683',
        city: 'Berlin',
      },
    },
  },
  {
    attributes: {},
    relations: {
      translations: [{ name: 'Kalkscheune', language: 'de' }],
      address: {
        street1: 'Johannisstraße 2',
        zipCode: '10117',
        city: 'Berlin',
      },
    },
  },
  {
    attributes: { phone: '+49 30 25488999' },
    relations: {
      translations: [{ name: 'Philharmonie', language: 'de' }],
      address: {
        street1: 'Herbert-von-Karajan-Straße 1',
        zipCode: '10785',
        city: 'Berlin',
      },
    },
  },
];

export default theaters;
