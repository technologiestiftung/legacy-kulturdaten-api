const museums = [
  {
    attributes: {},
    relations: {
      translations: [
        {
          name: 'Deutsche Kinemathek - Museum für Film und Fernsehen',
          language: 'de',
        },
        { name: 'Museum of Film and Television Berlin', language: 'en' },
      ],
      address: {
        street1: 'Potsdamer Straße 2',
        zipCode: '10785',
        city: 'Berlin',
      },
    },
  },
  {
    attributes: {
      email: 'info@stasimuseum.de',
      homepage: 'https://www.stasimuseum.de/',
      phone: '+49 30 55368-54',
    },
    relations: {
      translations: [
        { name: 'Stasimuseum', language: 'de' },
        { name: 'Stasi Museum', language: 'en' },
      ],
      address: {
        street1: 'Ruschestraße 103',
        zipCode: '10365',
        city: 'Berlin',
      },
    },
  },
  {
    attributes: {},
    relations: {
      translations: [
        { name: 'Feuerwehrmuseum Berlin', language: 'de' },
        { name: 'Fire Departnent Museum Berlin', language: 'en' },
      ],
      address: {
        street1: 'Veitstraße 5',
        zipCode: '13507',
        city: 'Berlin',
      },
    },
  },
  {
    attributes: {},
    relations: {
      translations: [
        { name: 'Museum für Kommunikation', language: 'de' },
        { name: 'Communication Museum Berlin', language: 'en' },
      ],
      address: {
        street1: 'Leipziger Straße 16',
        zipCode: '10117',
        city: 'Berlin',
      },
    },
  },
  {
    attributes: {},
    relations: {
      translations: [
        {
          name: 'Dalí - Die Ausstellung am Potsdamer Platz',
          language: 'de',
        },
      ],
      address: {
        street1: 'Leipziger Platz 7',
        zipCode: '10117',
        city: 'Berlin',
      },
    },
  },
  {
    attributes: {},
    relations: {
      translations: [
        {
          name: 'Erinnerungsstätte Notaufnahmelager Marienfelde',
          language: 'de',
        },
      ],
      address: {
        street1: 'Marienfelder Allee 66/80',
        zipCode: '12277',
        city: 'Berlin',
      },
    },
  },
  {
    attributes: {},
    relations: {
      translations: [
        { name: 'Anti-Kriegs-Museum', language: 'de' },
        { name: 'Anti War Museum', language: 'en' },
      ],
      address: {
        street1: 'Brüsseler Straße 21',
        zipCode: '13353',
        city: 'Berlin',
      },
    },
  },
  {
    attributes: {},
    relations: {
      translations: [
        { name: 'Puppentheater-Museum Berlin', language: 'de' },
        { name: 'Puppet Theater Museum Berlin', language: 'en' },
      ],
      address: {
        street1: 'Karl-Marx-Straße 135',
        zipCode: '12043',
        city: 'Berlin',
      },
    },
  },
  {
    attributes: { phone: '+49-30-49910517' },
    relations: {
      translations: [
        { name: 'Berliner Unterwelten-Museum', language: 'de' },
        { name: 'Berlin Underworlds Museum', language: 'en' },
      ],
      address: {
        street1: 'Brunnenstraße 105',
        zipCode: '13355',
        city: 'Berlin',
      },
    },
  },
  {
    attributes: {},
    relations: {
      translations: [
        { name: 'Heimatmuseum Zehlendorf', language: 'de' },
        { name: 'Native Country Museum Zehlendorf', language: 'en' },
      ],
      address: {
        street1: 'Clayallee 355',
        zipCode: '14169',
        city: 'Berlin',
      },
    },
  },
  {
    attributes: {
      homepage: 'https://www.museumfuernaturkunde.berlin/',
      phone: '+49 30 20938591',
    },
    relations: {
      translations: [{ name: 'Museum für Naturkunde', language: 'de' }],
      address: {
        street1: 'Invalidenstraße 43',
        zipCode: '10115',
        city: 'Berlin',
      },
    },
  },
  {
    attributes: {},
    relations: {
      translations: [{ name: 'Galgenhaus Stadtmuseum Berlin', language: 'de' }],
      address: {
        street1: 'Brüderstraße 10',
        zipCode: '10178',
        city: 'Berlin',
      },
    },
  },
  {
    attributes: {},
    relations: {
      translations: [{ name: 'Hugenottenmuseum Berlin', language: 'de' }],
      address: {
        street1: 'Gendarmenmarkt 5',
        zipCode: '10117',
        city: 'Berlin',
      },
    },
  },
  {
    attributes: {},
    relations: {
      translations: [
        {
          name: 'Historische Ausstellung des Dt. Bundestages',
          language: 'de',
        },
        {
          name: 'Historical Exhibition of the German Bundestag',
          language: 'en',
        },
      ],
      address: {
        street1: 'Gendarmenmarkt 1',
        zipCode: '10117',
        city: 'Berlin',
      },
    },
  },
  {
    attributes: {},
    relations: {
      translations: [
        { name: 'Polizeimuseum', language: 'de' },
        { name: 'Police Museum Berlin', language: 'en' },
      ],
      address: {
        street1: 'Platz der Luftbrücke 6',
        zipCode: '12101',
        city: 'Berlin',
      },
    },
  },
  {
    attributes: {
      email: 'info@fhxb-museum.de',
      homepage: 'https://www.fhxb-museum.de/',
      phone: '+49 30 50585233',
    },
    relations: {
      translations: [
        { name: 'FHXB Friedrichshain-Kreuzberg Museum', language: 'de' },
      ],
      address: {
        street1: 'Adalbertstraße 95a',
        zipCode: '10999',
        city: 'Berlin',
      },
    },
  },
  {
    attributes: { phone: '+4930800931150' },
    relations: {
      translations: [
        { name: 'Labyrinth Kindermuseum', language: 'de' },
        { name: "Labyrinth Children's Museum", language: 'en' },
      ],
      address: {
        street1: 'Osloer Straße 12',
        zipCode: '13359',
        city: 'Berlin',
      },
    },
  },
  {
    attributes: {},
    relations: {
      translations: [{ name: 'Anna-Seghers-Gedenkstätte', language: 'de' }],
      address: {
        street1: 'Anna-Seghers-Straße 81',
        zipCode: '12489',
        city: 'Berlin',
      },
    },
  },
  {
    attributes: { homepage: 'http://www.wassermuseum-berlin.de' },
    relations: {
      translations: [
        { name: 'WasserWerkstatt des WasserMuseum e.V.', language: 'de' },
      ],
      address: {
        street1: 'Dillenburger Straße 57 (Tor 2)',
        zipCode: '14199',
        city: 'Berlin',
      },
    },
  },
  {
    attributes: {
      email: 'info@museum-lichtenberg.de',
      homepage: 'http://www.museum-lichtenberg.de',
      phone: '+49 30 5779738811',
    },
    relations: {
      translations: [
        { name: 'Museum Lichtenberg im Stadthaus', language: 'de' },
      ],
      address: {
        street1: 'Türrschmidtstraße 24',
        zipCode: '10317',
        city: 'Berlin',
      },
    },
  },
  {
    attributes: {
      email: 'computerspiele@xhibit.de',
      homepage: 'http://www.computerspielemuseum.de',
      phone: '+49 30 60988577',
    },
    relations: {
      translations: [
        { name: 'Computerspielemuseum Berlin', language: 'de' },
        { name: 'Videogames Museum Berlin', language: 'en' },
      ],
      address: {
        street1: 'Karl-Marx-Allee 93a',
        zipCode: '10243',
        city: 'Berlin',
      },
    },
  },
  {
    attributes: {
      homepage: 'http://www.erstesberliner-ddr-motorradmuseum.de',
      phone: '+49 30 24045725',
    },
    relations: {
      translations: [
        { name: '1. Berliner DDR Motorrad-Museum', language: 'de' },
      ],
      address: {
        street1: 'Rochstraße 14c',
        zipCode: '10178',
        city: 'Berlin',
      },
    },
  },
  {
    attributes: {
      homepage: 'http://zillemuseum-berlin.de/',
      phone: '+493024632500',
    },
    relations: {
      translations: [{ name: 'Zille-Museum', language: 'de' }],
      address: {
        street1: 'Propststraße 11',
        zipCode: '10178',
        city: 'Berlin',
      },
    },
  },
  {
    attributes: {},
    relations: {
      translations: [{ name: 'Museum Pankow', language: 'de' }],
      address: {
        street1: 'Heynstraße 8',
        zipCode: '13187',
        city: 'Berlin',
      },
    },
  },
  {
    attributes: {},
    relations: {
      translations: [
        {
          name: 'HTW Berlin, Campus Wilhelminenhof, Geb. C (Computermuseum)',
          language: 'de',
        },
      ],
      address: {
        street1: 'Wilhelminenhofstraße 75 A',
        zipCode: '12459',
        city: 'Berlin',
      },
    },
  },
  {
    attributes: {},
    relations: {
      translations: [
        { name: 'Museum Blindenwerkstatt Otto Weidt', language: 'de' },
      ],
      address: {
        street1: 'Rosenthaler Straße 39',
        zipCode: '10178',
        city: 'Berlin',
      },
    },
  },
  {
    attributes: {},
    relations: {
      translations: [{ name: 'Werkbund Berlin', language: 'de' }],
      address: {
        street1: 'Goethestraße 13B',
        zipCode: '10623',
        city: 'Berlin',
      },
    },
  },
  {
    attributes: { phone: '+49 30 7877070' },
    relations: {
      translations: [{ name: 'Forum Willy Brandt Berlin', language: 'de' }],
      address: {
        street1: 'Behrenstraße 15',
        zipCode: '10117',
        city: 'Berlin',
      },
    },
  },
  {
    attributes: {
      email: 'info@kommunalegalerie-berlin.de',
      homepage: 'http://www.kommunalegalerie-berlin.de/',
      phone: '+49 30 902916704',
    },
    relations: {
      translations: [
        {
          name: 'Ausstellungen in der Kleinen Orangerie am Schloss Charlottenburg',
          language: 'de',
        },
      ],
      address: {
        street1: 'Spandauer Damm 22',
        zipCode: '14059',
        city: 'Berlin',
      },
    },
  },
  {
    attributes: { phone: '+49 30 450-536156' },
    relations: {
      translations: [
        {
          name: 'Berliner Medizinhistorisches Museum der Charité',
          language: 'de',
        },
        {
          name: 'Berlin Museum of Medical History at the Charité',
          language: 'en',
        },
      ],
      address: {
        street1: 'Charitéplatz 1',
        zipCode: '10117',
        city: 'Berlin',
      },
    },
  },
  {
    attributes: {},
    relations: {
      translations: [{ name: 'Anne Frank Zentrum', language: 'de' }],
      address: {
        street1: 'Rosenthaler Straße 39',
        zipCode: '10178',
        city: 'Berlin',
      },
    },
  },
  {
    attributes: {},
    relations: {
      translations: [{ name: 'Uhrenmuseum', language: 'de' }],
      address: {
        street1: 'Rheinstraße 59',
        zipCode: '12159',
        city: 'Berlin',
      },
    },
  },
  {
    attributes: {
      email: 'info@mauermuseum.de',
      homepage: 'http://www.mauermuseum.de/',
      phone: '+49 30 2537250',
    },
    relations: {
      translations: [
        { name: 'Mauermuseum', language: 'de' },
        { name: 'Wall Museum', language: 'en' },
      ],
      address: {
        street1: 'Friedrichstraße 43-45',
        zipCode: '10969',
        city: 'Berlin',
      },
    },
  },
  {
    attributes: {},
    relations: {
      translations: [
        { name: 'Waldmuseum', language: 'de' },
        { name: 'Forest Museum', language: 'en' },
      ],
      address: {
        street1: 'Königsweg 4',
        zipCode: '14193',
        city: 'Berlin',
      },
    },
  },
  {
    attributes: {
      homepage: 'http://www.museumderdinge.de',
      phone: '+49 30 92106311',
    },
    relations: {
      translations: [{ name: 'Museum der Dinge', language: 'de' }],
      address: {
        street1: 'Oranienstraße 25',
        zipCode: '10999',
        city: 'Berlin',
      },
    },
  },
  {
    attributes: {},
    relations: {
      translations: [{ name: 'DDR-Museumswohnung WBS 70', language: 'de' }],
      address: {
        street1: 'Hellersdorfer Straße 179',
        zipCode: '12627',
        city: 'Berlin',
      },
    },
  },
  {
    attributes: {},
    relations: {
      translations: [
        { name: 'Schwules Museum*', language: 'de' },
        { name: 'Gay Museum*', language: 'en' },
      ],
      address: {
        street1: 'Lützowstraße 73',
        zipCode: '10785',
        city: 'Berlin',
      },
    },
  },
  {
    attributes: { homepage: 'https://www.ramonesmuseum.com/' },
    relations: {
      translations: [{ name: 'Ramones Museum', language: 'de' }],
      address: {
        street1: 'Oberbaumstraße 5',
        zipCode: '10997',
        city: 'Berlin',
      },
    },
  },
  {
    attributes: { homepage: 'https://www.gamesciencecenter.de/' },
    relations: {
      translations: [{ name: 'Game Science Center', language: 'de' }],
      address: {
        street1: 'Besselstraße 14',
        zipCode: '10969',
        city: 'Berlin',
      },
    },
  },
  {
    attributes: { phone: '+49 30 20304-0' },
    relations: {
      translations: [{ name: 'Deutsches Historisches Museum', language: 'de' }],
      address: {
        street1: 'Unter den Linden 2',
        zipCode: '10117',
        city: 'Berlin',
      },
    },
  },
  {
    attributes: {},
    relations: {
      translations: [{ name: 'Trabi Museum', language: 'de' }],
      address: {
        street1: 'Zimmerstraße 14-15',
        zipCode: '10969',
        city: 'Berlin',
      },
    },
  },
  {
    attributes: { homepage: 'http://www.rotkreuzmuseum-berlin.drk.de/' },
    relations: {
      translations: [{ name: 'Rotkreuz-Museum', language: 'de' }],
      address: {
        street1: 'Bachestraße 11',
        zipCode: '12161',
        city: 'Berlin',
      },
    },
  },
  {
    attributes: {
      email: 'memu@MeMu.berlin',
      homepage: 'https://koerperwelten.de/ausstellung/berlin/',
      phone: '+49 30 847125526',
    },
    relations: {
      translations: [{ name: 'Menschen Museum', language: 'de' }],
      address: {
        street1: 'Panoramastraße 1A',
        zipCode: '10178',
        city: 'Berlin',
      },
    },
  },
  {
    attributes: {
      homepage: 'https://www.deutsches-spionagemuseum.de/',
      phone: '+49 30 398200451',
    },
    relations: {
      translations: [
        { name: 'Deutsches Spionagemuseum', language: 'de' },
        { name: 'German Spy Museum', language: 'en' },
      ],
      address: {
        street1: 'Leipziger Platz 9',
        zipCode: '10117',
        city: 'Berlin',
      },
    },
  },
  {
    attributes: {},
    relations: {
      translations: [{ name: 'Steglitz Museum', language: 'de' }],
      address: {
        street1: 'Drakestraße 64a',
        zipCode: '12205',
        city: 'Berlin',
      },
    },
  },
  {
    attributes: {},
    relations: {
      translations: [{ name: 'Gutshof Gatow', language: 'de' }],
      address: {
        street1: 'Buchwaldzeile 43',
        zipCode: '14089',
        city: 'Berlin',
      },
    },
  },
  {
    attributes: {},
    relations: {
      translations: [{ name: 'Museum der Stille', language: 'de' }],
      address: {
        street1: 'Linienstraße 154A',
        zipCode: '10115',
        city: 'Berlin',
      },
    },
  },
  {
    attributes: {},
    relations: {
      translations: [{ name: 'Ritter Sport Museum', language: 'de' }],
      address: {
        street1: 'Französische Straße 24',
        zipCode: '10117',
        city: 'Berlin',
      },
    },
  },
  {
    attributes: {
      homepage: 'https://www.madametussauds.com/berlin/de/',
      phone: '+49 30 40004610',
    },
    relations: {
      translations: [{ name: 'Madame Tussauds', language: 'de' }],
      address: {
        street1: 'Unter den Linden 74',
        zipCode: '10117',
        city: 'Berlin',
      },
    },
  },
  {
    attributes: {},
    relations: {
      translations: [{ name: 'Urban Nation', language: 'de' }],
      address: {
        street1: 'Bülowstraße 7',
        zipCode: '10783',
        city: 'Berlin',
      },
    },
  },
  {
    attributes: {},
    relations: {
      translations: [{ name: 'Daimler Contemporary Berlin', language: 'de' }],
      address: {
        street1: 'Alte Potsdamer Straße 5',
        zipCode: '10785',
        city: 'Berlin',
      },
    },
  },
  {
    attributes: {},
    relations: {
      translations: [
        { name: 'Braun-Sammlung Ettel Museum für Design', language: 'de' },
        { name: 'Braun Design Museum', language: 'en' },
      ],
      address: { street1: 'Elberfelder Straße 37', zipCode: '10555' },
    },
  },
  {
    attributes: {},
    relations: {
      translations: [{ name: 'Hanf Museum Berlin', language: 'de' }],
      address: {
        street1: 'Mühlendamm 5',
        zipCode: '10178',
        city: 'Berlin',
      },
    },
  },
  {
    attributes: {},
    relations: {
      translations: [{ name: 'Designpanoptikum', language: 'de' }],
      address: {
        street1: 'Poststraße 7',
        zipCode: '10178',
        city: 'Berlin',
      },
    },
  },
  {
    attributes: { phone: '+49 30 832159120' },
    relations: {
      translations: [
        {
          name: 'Kindl - Zentrum für zeitgenössische Kunst',
          language: 'de',
        },
      ],
      address: {
        street1: 'Am Sudhaus 3',
        zipCode: '12053',
        city: 'Berlin',
      },
    },
  },
  {
    attributes: {},
    relations: {
      translations: [
        { name: 'Julia Stoschek Collection Berlin', language: 'de' },
      ],
      address: { street1: 'Leipziger Straße 60', zipCode: '10117' },
    },
  },
  {
    attributes: {},
    relations: {
      translations: [{ name: 'KiKuFri', language: 'de' }],
      address: {
        street1: 'Bundesplatz 17',
        zipCode: '10715',
        city: 'Berlin',
      },
    },
  },
  {
    attributes: {},
    relations: {
      translations: [{ name: 'Hatch Sticker Museum', language: 'de' }],
      address: {
        street1: 'Schreinerstraße 10',
        zipCode: '10247',
        city: 'Berlin',
      },
    },
  },
  {
    attributes: {},
    relations: {
      translations: [{ name: 'Jagdschloss Grunewald', language: 'de' }],
      address: {
        street1: 'Hüttenweg 100',
        zipCode: '14193',
        city: 'Berlin',
      },
    },
  },
  {
    attributes: {},
    relations: {
      translations: [
        { name: 'Museum der Illusionen', language: 'de' },
        { name: 'Museum of illusions', language: 'en' },
      ],
      address: { street1: 'Karl-Liebknecht-Straße 9' },
    },
  },
  {
    attributes: {},
    relations: {
      translations: [{ name: 'Tempelhof Museum', language: 'de' }],
      address: {
        street1: 'Alt-Mariendorf 43',
        zipCode: '12107',
        city: 'Berlin',
      },
    },
  },
  {
    attributes: {
      email: 'gf@smb.spk-berlin.de',
      homepage: 'https://www.smb.museum/museen-und-einrichtungen/gipsformerei/',
      phone: '+49 30 32676911',
    },
    relations: {
      translations: [{ name: 'Gipsformerei', language: 'de' }],
      address: {
        street1: 'Sophie-Charlotten-Straße 17/18',
        zipCode: '14059',
        city: 'Berlin',
      },
    },
  },
  {
    attributes: {},
    relations: {
      translations: [{ name: 'Samurai Art Museum', language: 'de' }],
      address: {
        street1: 'Clayallee 225D',
        zipCode: '14195',
        city: 'Berlin',
      },
    },
  },
  {
    attributes: { homepage: 'https://www.officiallittlebigcity.com/' },
    relations: {
      translations: [{ name: 'Little Big City', language: 'de' }],
      address: {
        street1: 'Panoramastraße 1A',
        zipCode: '10178',
        city: 'Berlin',
      },
    },
  },
  {
    attributes: {
      homepage: 'https://www.berlin.de/museum-pankow/',
      phone: '+49 30 902953917',
    },
    relations: {
      translations: [{ name: 'Museum Pankow', language: 'de' }],
      address: {
        street1: 'Prenzlauer Allee 227/228',
        zipCode: '10405',
        city: 'Berlin',
      },
    },
  },
  {
    attributes: {},
    relations: {
      translations: [{ name: 'MACHmit! Museum für Kinder', language: 'de' }],
      address: {
        street1: 'Senefelderstraße 5/6',
        zipCode: '10437',
        city: 'Berlin',
      },
    },
  },
  {
    attributes: {
      homepage:
        'http://www.berlin.de/tickets/suche/ort.php?ort=7084;http://www.smb.spk-berlin.de/smb/sammlungen/details.php?lang=de&objID=12807&n=13&r=5',
    },
    relations: {
      translations: [
        { name: 'Sammlung Scharf-Gerstenberg', language: 'de' },
        { name: 'Scharf-Gerstenberg Collection', language: 'en' },
      ],
      address: {
        street1: 'Schloßstraße 70',
        zipCode: '14059',
        city: 'Berlin',
      },
    },
  },
  {
    attributes: {},
    relations: {
      translations: [
        { name: 'Abguss-Sammlung Antiker Plastik', language: 'de' },
      ],
      address: {
        street1: 'Schloßstraße 69B',
        zipCode: '14059',
        city: 'Berlin',
      },
    },
  },
  {
    attributes: {
      homepage: 'http://ausstellung-dunckerstrasse.de/',
      phone: '+49 30 4452321',
    },
    relations: {
      translations: [
        { name: 'Zimmermeister Brunzel baut ein Mietshaus', language: 'de' },
      ],
      address: {
        street1: 'Dunckerstraße 77',
        zipCode: '10437',
        city: 'Berlin',
      },
    },
  },
  {
    attributes: {},
    relations: {
      translations: [{ name: 'Gallery of Steel Figures', language: 'de' }],
      address: {
        street1: 'Unter den Linden 14',
        zipCode: '10117',
        city: 'Berlin',
      },
    },
  },
  {
    attributes: {},
    relations: {
      translations: [
        { name: 'Museum der Staatlichen Münze Berlin', language: 'de' },
      ],
      address: {
        street1: 'Ollenhauerstraße 97',
        zipCode: '13403',
        city: 'Berlin',
      },
    },
  },
  {
    attributes: { phone: '+49 30 266424242' },
    relations: {
      translations: [
        { name: 'Neues Museum', language: 'de' },
        { name: 'New Museum', language: 'en' },
      ],
      address: {
        street1: 'Bodestraße 1',
        zipCode: '10178',
        city: 'Berlin',
      },
    },
  },
  {
    attributes: {},
    relations: {
      translations: [
        { name: 'Schloss Schönhausen', language: 'de' },
        { name: 'Schönhausen Palace', language: 'en' },
      ],
      address: {
        street1: 'Tschaikowskistraße 1',
        zipCode: '13156',
        city: 'Berlin',
      },
    },
  },
  {
    attributes: {
      email: 'info@topographie.de',
      homepage: 'http://www.topographie.de/',
    },
    relations: {
      translations: [
        { name: 'Topographie des Terrors', language: 'de' },
        { name: 'Topography of Terror', language: 'en' },
      ],
      address: {
        street1: 'Niederkirchnerstraße 8',
        zipCode: '10963',
        city: 'Berlin',
      },
    },
  },
  {
    attributes: {},
    relations: {
      translations: [{ name: 'Alliierte in Berlin', language: 'de' }],
      address: {
        street1: 'Kurt-Schumacher-Damm 42-44',
        zipCode: '13405',
        city: 'Berlin',
      },
    },
  },
  {
    attributes: {
      homepage: 'http://www.gruenderzeitmuseum-mahlsdorf.de/',
      phone: '+49 30 5678329',
    },
    relations: {
      translations: [
        { name: 'Gründerzeitmuseum im Gutshaus Mahlsdorf', language: 'de' },
      ],
      address: {
        street1: 'Hultschiner Damm 333',
        zipCode: '12623',
        city: 'Berlin',
      },
    },
  },
  {
    attributes: {},
    relations: {
      translations: [
        { name: 'Museum für Fotografie', language: 'de' },
        { name: 'Museum of Photography', language: 'en' },
      ],
      address: {
        street1: 'Jebensstraße 2',
        zipCode: '10623',
        city: 'Berlin',
      },
    },
  },
  {
    attributes: {
      email: 'info@liebermann-villa.de',
      homepage: 'http://www.liebermann-villa.de/',
      phone: '+49 30 80585900',
    },
    relations: {
      translations: [{ name: 'Liebermann-Villa', language: 'de' }],
      address: {
        street1: 'Colomierstraße 3',
        zipCode: '14109',
        city: 'Berlin',
      },
    },
  },
  {
    attributes: {},
    relations: {
      translations: [{ name: 'Museum Neukölln', language: 'de' }],
      address: {
        street1: 'Alt-Britz 81',
        zipCode: '12359',
        city: 'Berlin',
      },
    },
  },
  {
    attributes: {},
    relations: {
      translations: [
        { name: 'Botanisches Museum Berlin-Dahlem', language: 'de' },
        { name: 'Botanical Museum Berlin-Dahlem', language: 'en' },
      ],
      address: {
        street1: 'Königin-Luise-Straße 6-8',
        zipCode: '14195',
        city: 'Berlin',
      },
    },
  },
  {
    attributes: {},
    relations: {
      translations: [
        { name: 'Museumsdorf Düppel', language: 'de' },
        { name: 'Museum Village Düppel', language: 'en' },
      ],
      address: {
        street1: 'Clauertstraße 11',
        zipCode: '14163',
        city: 'Berlin',
      },
    },
  },
  {
    attributes: {},
    relations: {
      translations: [{ name: 'SA-Gefängnis Papestraße', language: 'de' }],
      address: {
        street1: 'Werner-Voß-Damm 54A',
        zipCode: '12101',
        city: 'Berlin',
      },
    },
  },
  {
    attributes: {},
    relations: {
      translations: [{ name: 'Ruine der Künste', language: 'de' }],
      address: {
        street1: 'Hittorfstraße 5',
        zipCode: '14195',
        city: 'Berlin',
      },
    },
  },
  {
    attributes: {},
    relations: {
      translations: [{ name: 'Haus am Waldsee', language: 'de' }],
      address: {
        street1: 'Argentinische Allee 30',
        zipCode: '14163',
        city: 'Berlin',
      },
    },
  },
  {
    attributes: {},
    relations: {
      translations: [
        {
          name: 'Bezirksmuseum Marzahn-Hellersdorf, Haus 1',
          language: 'de',
        },
      ],
      address: {
        street1: 'Alt-Marzahn 51',
        zipCode: '12685',
        city: 'Berlin',
      },
    },
  },
  {
    attributes: { homepage: 'http://www.technikmuseum-berlin.de' },
    relations: {
      translations: [
        { name: 'Deutsches Technikmuseum Berlin', language: 'de' },
        { name: 'German Museum of Technology', language: 'en' },
      ],
      address: {
        street1: 'Trebbiner Straße 9',
        zipCode: '10963',
        city: 'Berlin',
      },
    },
  },
  {
    attributes: { homepage: 'http://kunsthaus-dahlem.de/' },
    relations: {
      translations: [{ name: 'Kunsthaus Dahlem', language: 'de' }],
      address: {
        street1: 'Käuzchensteig 8',
        zipCode: '14195',
        city: 'Berlin',
      },
    },
  },
  {
    attributes: {
      email: 'bg@berlinischegalerie.de',
      homepage: 'http://www.berlinischegalerie.de',
      phone: '+49 30 78902-600',
    },
    relations: {
      translations: [
        { name: 'Berlinische Galerie', language: 'de' },
        { name: 'Berlin Gallery', language: 'en' },
      ],
      address: {
        street1: 'Alte Jakobstraße 124-128',
        zipCode: '10969',
        city: 'Berlin',
      },
    },
  },
  {
    attributes: {},
    relations: {
      translations: [{ name: 'Schmetterlingshorst', language: 'de' }],
      address: {
        street1: 'Zum Schmetterlingshorst 2',
        zipCode: '12559',
        city: 'Berlin',
      },
    },
  },
  {
    attributes: {
      homepage: 'http://www.ghwk.de/',
      phone: '+49 30 8050010',
    },
    relations: {
      translations: [
        { name: 'Haus der Wannseekonferenz', language: 'de' },
        { name: 'House of the Wannsee Conference', language: 'en' },
      ],
      address: {
        street1: 'Am Großen Wannsee 58',
        zipCode: '14109',
        city: 'Berlin',
      },
    },
  },
  {
    attributes: {},
    relations: {
      translations: [{ name: 'Museum Kesselhaus', language: 'de' }],
      address: {
        street1: 'Herzbergstraße 79',
        zipCode: '10365',
        city: 'Berlin',
      },
    },
  },
  {
    attributes: {},
    relations: {
      translations: [{ name: 'Direktorenhaus Berlin', language: 'de' }],
      address: {
        street1: 'Am Krögel 2',
        zipCode: '10179',
        city: 'Berlin',
      },
    },
  },
  {
    attributes: {
      email: 'info@traenenpalast.de',
      homepage: 'http://www.traenenpalast.de',
      phone: '+49 30 2061000',
    },
    relations: {
      translations: [
        { name: 'Tränenpalast', language: 'de' },
        { name: 'Palace of Tears', language: 'en' },
      ],
      address: {
        street1: 'Reichstagufer 17',
        zipCode: '10117',
        city: 'Berlin',
      },
    },
  },
  {
    attributes: { homepage: 'https://www.energie-museum.de/' },
    relations: {
      translations: [
        { name: 'Energie-Museum', language: 'de' },
        { name: 'Energy Museum', language: 'en' },
      ],
      address: {
        street1: 'Teltowkanalstraße 9',
        zipCode: '12247',
        city: 'Berlin',
      },
    },
  },
  {
    attributes: {},
    relations: {
      translations: [
        {
          name: 'Gedenkstätte Berliner Mauer (Dokumentationszentrum)',
          language: 'de',
        },
        {
          name: 'Gedenkstätte Berliner Mauer (Documentation Centre)',
          language: 'en',
        },
      ],
      address: {
        street1: 'Bernauer Straße 111',
        zipCode: '13355',
        city: 'Berlin',
      },
    },
  },
  {
    attributes: {},
    relations: {
      translations: [
        { name: 'Otto Bock Science Center Medizintechnik', language: 'de' },
      ],
      address: {
        street1: 'Ebertstraße 15a',
        zipCode: '10117',
        city: 'Berlin',
      },
    },
  },
  {
    attributes: {
      homepage: 'http://www.blindenmuseum-berlin.de',
      phone: '+49 30 79709094',
    },
    relations: {
      translations: [{ name: 'Deutsches Blinden-Museum', language: 'de' }],
      address: {
        street1: 'Rothenburgstraße 14',
        zipCode: '12165',
        city: 'Berlin',
      },
    },
  },
  {
    attributes: {},
    relations: {
      translations: [
        { name: 'Reichsbahnbunker Friedrichstraße', language: 'de' },
      ],
      address: {
        street1: 'Reinhardtstraße 20',
        zipCode: '10117',
        city: 'Berlin',
      },
    },
  },
  {
    attributes: {},
    relations: {
      translations: [
        {
          name: 'Gedenkstätte Berliner Mauer (Besucherzentrum)',
          language: 'de',
        },
        { name: 'Berlin Wall Memorial', language: 'en' },
      ],
      address: {
        street1: 'Bernauer Straße 119',
        zipCode: '13355',
        city: 'Berlin',
      },
    },
  },
  {
    attributes: {
      email: 'info@georg-kolbe-museum.de',
      homepage: 'http://www.georg-kolbe-museum.de',
      phone: '+49 (30) 3042144',
    },
    relations: {
      translations: [
        { name: 'Georg-Kolbe-Museum', language: 'de' },
        { name: 'Georg Kolbe Museum', language: 'en' },
      ],
      address: {
        street1: 'Sensburger Allee 25',
        zipCode: '14055',
        city: 'Berlin',
      },
    },
  },
  {
    attributes: {},
    relations: {
      translations: [{ name: 'Heimatmuseum Reinickendorf', language: 'de' }],
      address: {
        street1: 'Alt-Hermsdorf 35',
        zipCode: '13467',
        city: 'Berlin',
      },
    },
  },
  {
    attributes: {
      homepage: 'http://www.villa-oppenheim-berlin.de/',
      phone: '+49 30 9029-24101',
    },
    relations: {
      translations: [
        {
          name: 'Museum Charlottenburg-Wilmersdorf in der Villa Oppenheim',
          language: 'de',
        },
      ],
      address: {
        street1: 'Schloßstraße 55',
        zipCode: '14059',
        city: 'Berlin',
      },
    },
  },
  {
    attributes: {
      homepage: 'http://www.alliiertenmuseum.de',
      phone: '+49 30 8181990',
    },
    relations: {
      translations: [
        { name: 'Alliierten-Museum', language: 'de' },
        { name: 'Allied Museum', language: 'en' },
      ],
      address: {
        street1: 'Clayallee 135',
        zipCode: '14195',
        city: 'Berlin',
      },
    },
  },
  {
    attributes: {},
    relations: {
      translations: [{ name: 'Museum Berggruen', language: 'de' }],
      address: {
        street1: 'Spandauer Damm 17',
        zipCode: '14059',
        city: 'Berlin',
      },
    },
  },
  {
    attributes: {},
    relations: {
      translations: [{ name: 'Rixdorfer Schmiede', language: 'de' }],
      address: {
        street1: 'Richardplatz 28',
        zipCode: '12055',
        city: 'Berlin',
      },
    },
  },
  {
    attributes: { homepage: 'http://www.broehan-museum.de/' },
    relations: {
      translations: [{ name: 'Bröhan-Museum', language: 'de' }],
      address: {
        street1: 'Schloßstraße 1',
        zipCode: '14059',
        city: 'Berlin',
      },
    },
  },
  {
    attributes: { phone: '+49 30 22633030' },
    relations: {
      translations: [{ name: 'Max-Liebermann-Haus', language: 'de' }],
      address: {
        street1: 'Pariser Platz 7',
        zipCode: '10117',
        city: 'Berlin',
      },
    },
  },
  {
    attributes: {},
    relations: {
      translations: [{ name: 'Museum in der Kulturbrauerei', language: 'de' }],
      address: {
        street1: 'Knaackstraße 97',
        zipCode: '10435',
        city: 'Berlin',
      },
    },
  },
  {
    attributes: { homepage: 'http://www.bmvbs.de' },
    relations: {
      translations: [
        { name: 'Effizienzhaus-Plus mit Elektromobilität', language: 'de' },
      ],
      address: {
        street1: 'Fasanenstraße 87a',
        zipCode: '10623',
        city: 'Berlin',
      },
    },
  },
  {
    attributes: { homepage: 'https://www.ns-zwangsarbeit.de/' },
    relations: {
      translations: [
        { name: 'Dokumentationszentrum NS-Zwangsarbeit', language: 'de' },
      ],
      address: {
        street1: 'Britzer Straße 5',
        zipCode: '12439',
        city: 'Berlin',
      },
    },
  },
  {
    attributes: {},
    relations: {
      translations: [{ name: 'Ort der Information', language: 'de' }],
      address: {
        street1: 'Cora-Berliner-Straße 1',
        zipCode: '10117',
        city: 'Berlin',
      },
    },
  },
  {
    attributes: {},
    relations: {
      translations: [{ name: 'Berlin Story Bunker', language: 'de' }],
      address: {
        street1: 'Schöneberger Straße 23A',
        zipCode: '10963',
        city: 'Berlin',
      },
    },
  },
  {
    attributes: {
      homepage: 'http://www.ddr-museum.de',
      phone: '+49-30-847123730',
    },
    relations: {
      translations: [{ name: 'DDR-Museum', language: 'de' }],
      address: {
        street1: 'Karl-Liebknecht-Straße 1',
        zipCode: '10178',
        city: 'Berlin',
      },
    },
  },
  {
    attributes: { homepage: 'https://www.schwerbelastungskoerper.de/' },
    relations: {
      translations: [
        { name: 'Informationsort Schwerbelastungskörper', language: 'de' },
      ],
      address: {
        street1: 'General-Pape-Straße 100',
        zipCode: '12101',
        city: 'Berlin',
      },
    },
  },
  {
    attributes: {},
    relations: {
      translations: [
        { name: 'asisi Panorama Berlin Die Mauer', language: 'de' },
        { name: 'asisi Panorama - The Wall', language: 'en' },
      ],
      address: {
        street1: 'Friedrichstraße 205',
        zipCode: '10117',
        city: 'Berlin',
      },
    },
  },
  {
    attributes: { homepage: 'http://www.tchoban-foundation.de/' },
    relations: {
      translations: [
        { name: 'Museum für Architekturzeichnung', language: 'de' },
      ],
      address: {
        street1: 'Christinenstraße 18a',
        zipCode: '10119',
        city: 'Berlin',
      },
    },
  },
  {
    attributes: {},
    relations: {
      translations: [
        { name: 'Schloss Charlottenburg', language: 'de' },
        { name: 'Charlottenburg Palace', language: 'en' },
      ],
      address: {
        street1: 'Spandauer Damm 10',
        zipCode: '14059',
        city: 'Berlin',
      },
    },
  },
  {
    attributes: {},
    relations: {
      translations: [
        {
          name: 'Alte Bäckerei – Museum für Kindheit in Pankow',
          language: 'de',
        },
      ],
      address: {
        street1: 'Wollankstraße 130',
        zipCode: '13187',
        city: 'Berlin',
      },
    },
  },
  {
    attributes: { homepage: 'http://www.industriesalon.de/' },
    relations: {
      translations: [{ name: 'Industriesalon Schöneweide', language: 'de' }],
      address: {
        street1: 'Reinbeckstraße 9',
        zipCode: '12459',
        city: 'Berlin',
      },
    },
  },
  {
    attributes: {},
    relations: {
      translations: [{ name: 'Museumsdorf Düppel', language: 'de' }],
      address: {
        street1: 'Clauertstraße 11',
        zipCode: '14163',
        city: 'Berlin',
      },
    },
  },
  {
    attributes: {
      homepage: 'http://www.stadtmuseum.de/ephraim-palais',
      phone: '+49 30 24002162',
    },
    relations: {
      translations: [{ name: 'Ephraim-Palais', language: 'de' }],
      address: {
        street1: 'Poststraße 16',
        zipCode: '10178',
        city: 'Berlin',
      },
    },
  },
  {
    attributes: {},
    relations: {
      translations: [
        { name: 'Jüdisches Museum', language: 'de' },
        { name: 'Jewish Museum', language: 'en' },
      ],
      address: {
        street1: 'Lindenstraße 9-14',
        zipCode: '10969',
        city: 'Berlin',
      },
    },
  },
  {
    attributes: {},
    relations: {
      translations: [
        { name: 'BlackBox Kalter Krieg', language: 'de' },
        { name: 'Cold War Checkpoint Charlie', language: 'en' },
      ],
      address: {
        street1: 'Friedrichstraße 47',
        zipCode: '10117',
        city: 'Berlin',
      },
    },
  },
  {
    attributes: { phone: '+49 30 20905577' },
    relations: {
      translations: [
        { name: 'Pergamonmuseum', language: 'de' },
        { name: 'Pergamon Museum', language: 'en' },
      ],
      address: {
        street1: 'Am Kupfergraben 5',
        zipCode: '10117',
        city: 'Berlin',
      },
    },
  },
  {
    attributes: { phone: '+49 30 20905577' },
    relations: {
      translations: [
        { name: 'Alte Nationalgalerie', language: 'de' },
        { name: 'Old National Gallery', language: 'en' },
      ],
      address: {
        street1: 'Bodestraße 1-3',
        zipCode: '10178',
        city: 'Berlin',
      },
    },
  },
  {
    attributes: {},
    relations: {
      translations: [
        { name: 'Ausstellung zur Berliner Märzrevolution', language: 'de' },
      ],
      address: {
        street1: 'Ernst-Zinna-Weg 1',
        zipCode: '10249',
        city: 'Berlin',
      },
    },
  },
  {
    attributes: { phone: '+49 30 45754158' },
    relations: {
      translations: [
        {
          name: 'Heimatmuseum (Mitte Museum am Gesundbrunnen)',
          language: 'de',
        },
      ],
      address: {
        street1: 'Pankstraße 47',
        zipCode: '13357',
        city: 'Berlin',
      },
    },
  },
  {
    attributes: {},
    relations: {
      translations: [{ name: 'Futurium', language: 'de' }],
      address: { street1: 'Alexanderufer 2', zipCode: '10117' },
    },
  },
  {
    attributes: {},
    relations: {
      translations: [{ name: 'Trabi Museum', language: 'de' }],
      address: { street1: 'Zimmerstraße 14-15', city: 'Berlin' },
    },
  },
  {
    attributes: {},
    relations: {
      translations: [{ name: 'Museum Kesselhaus', language: 'de' }],
      address: {
        street1: 'Herzbergstraße 79',
        zipCode: '10365',
        city: 'Berlin',
      },
    },
  },
  {
    attributes: {
      homepage: 'https://www.ns-zwangsarbeit.de/ausstellungen/baracke-13/',
    },
    relations: {
      translations: [
        {
          name: 'Dokumentationszentrum NS-Zwangsarbeit Berlin-Schöneweide: Baracke 13',
          language: 'de',
        },
      ],
      address: {
        street1: 'Köllnische Straße 17',
        zipCode: '12439',
        city: 'Berlin',
      },
    },
  },
  {
    attributes: {},
    relations: {
      translations: [{ name: 'Schöneberg Museum', language: 'de' }],
      address: {
        street1: 'Hauptstraße 40',
        zipCode: '10827',
        city: 'Berlin',
      },
    },
  },
  {
    attributes: {},
    relations: {
      translations: [{ name: 'Mies van der Rohe Haus', language: 'de' }],
      address: {
        street1: 'Oberseestraße 60',
        zipCode: '13053',
        city: 'Berlin',
      },
    },
  },
  {
    attributes: {
      homepage: 'http://www.stadtmuseum.de/maerkisches-museum',
      phone: '+49 30 24002162',
    },
    relations: {
      translations: [{ name: 'Märkisches Museum', language: 'de' }],
      address: {
        street1: 'Am Köllnischen Park 5',
        zipCode: '10179',
        city: 'Berlin',
      },
    },
  },
  {
    attributes: {},
    relations: {
      translations: [{ name: 'Archenhold-Sternwarte', language: 'de' }],
      address: {
        street1: 'Alt-Treptow 1',
        zipCode: '12435',
        city: 'Berlin',
      },
    },
  },
  {
    attributes: {},
    relations: {
      translations: [
        { name: 'Haus der Kulturen der Welt', language: 'de' },
        { name: 'House of the Cultures of the World', language: 'en' },
      ],
      address: {
        street1: 'John-Foster-Dulles-Allee 10',
        zipCode: '10557',
        city: 'Berlin',
      },
    },
  },
  {
    attributes: { phone: '+493020905577' },
    relations: {
      translations: [
        { name: 'Bode-Museum', language: 'de' },
        { name: 'Bode Museum', language: 'en' },
      ],
      address: {
        street1: 'Am Kupfergraben 1-3',
        zipCode: '10117',
        city: 'Berlin',
      },
    },
  },
  {
    attributes: { homepage: 'http://www.bruecke-museum.de/' },
    relations: {
      translations: [
        { name: 'Brücke-Museum', language: 'de' },
        { name: 'Bridges Museum', language: 'en' },
      ],
      address: {
        street1: 'Bussardsteig 9',
        zipCode: '14195',
        city: 'Berlin',
      },
    },
  },
  {
    attributes: {},
    relations: {
      translations: [{ name: 'Gropius-Bau', language: 'de' }],
      address: {
        street1: 'Niederkirchnerstraße 7',
        zipCode: '10963',
        city: 'Berlin',
      },
    },
  },
];

export default museums;
