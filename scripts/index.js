// global alert: false, console: false, jQuery: false, google: false, YT: false, threeSixtyManager: false

var hlguMap = (function ($) {
    'use strict';
    
    var mapController, navigationView, mapView, googleMap, contentView, searchManager, hlguMapData = {}, getKeyForValue, youtubeController, getMarkerContentById, stripTagsFromString, filterSelectWordsFromString, enable360 = false, isWebGLCompatible;
    
    isWebGLCompatible = function () {
        try {
            return !!window.WebGLRenderingContext && !!document.createElement('canvas').getContext('experimental-webgl');
        } catch (e) {
            return false;
        }
    };
    
    stripTagsFromString = function (html) {
        var element = document.createElement('div');
        element.innerHTML = html;
        return element.textContent || element.innerText || "";
    };
    
    filterSelectWordsFromString = function (string) {
        var words = ['of', 'the', 'in', 'on', 'at', 'to', 'a', 'is'], re = new RegExp('\\b(' + words.join('|') + ')\\b', 'gi');
        
        return (string || '').replace(re, '').replace(/[ ]{2,}/, ' ');
    };
    
    hlguMapData = {
        parameters : {
            mapType : "terrain",
            lat : 39.730750,
            lng : -91.392900,
            zoom : 17
        },
        settings : [
            {
                featureType: "administrative",
                elementType: "labels",
                stylers: [
                    { visibility: "off" }
                ]
            },
            {
                featureType: "poi",
                elementType: "labels",
                stylers: [
                    { visibility: "off" }
                ]
            },
            {
                featureType: "water",
                elementType: "labels",
                stylers: [
                    { visibility: "off" }
                ]
            },
            {
                featureType: "road",
                elementType: "labels",
                stylers: [
                    { visibility: "off" }
                ]
            }
        ],
        categories : {
            PointsOfInterest : "Points of Interest",
            AcademicsAndOffices : "Academics & Offices",
            Athletics : "Athletics",
            FoodAndDining : "Food & Dining",
            ResidenceHalls : "Residence Life",
            // Views360 : "360° Views"
        },
        contentTypes : {
            Photo360 : "360 Degree Photo",
            Video360 : "360 Degree Video",
            Video : "Video",
            HTML : "HTML"
        }
    };
    
    /* Define Markers */

    hlguMapData.markers = {

        /*
        EXAMPLE ENTRY

        NAME : {
            id : "ID_NAME",
            position : {
                lat : x,    // Increasing the latitude value moves northward; increasing
                lng : y     // the longitude value (closer to 0) moves eastward. 
            },
            categories : [
                hlguMapData.categories.PointsOfInterest
            ],
            content : {
                name : "name",
                contentType : hlguMapData.contentTypes.HTML,
                content : "description",
                images : [
                    { src : "./images/locations/turtle.png", caption : "caption", showCaption : true },
                ]
            }
        },
        */

        FLETCHER_NORTH_AND_SOUTH_HALLS : {
            id : "FLETCHER_NORTH_AND_SOUTH_HALLS",
            position : {
                lat : 39.735130, 
                lng : -91.390080
            }, 
            categories : [
                hlguMapData.categories.ResidenceHalls
            ],
            content : {
                name : 'Fletcher North and South Halls',
                contentType : hlguMapData.contentTypes.HTML,
                content : "Built in 2009, Fletcher is the largest men’s dorm on campus. Between North and South, Fletcher houses 105 male students in suite-style rooms.",
                images : [
                    { src : "./images/locations/residence_halls/fletcher_north_and_south_halls/fletcher_exterior_1.jpg", caption : "Fletcher North and South Halls", showCaption : true },
                    { src : "./images/locations/residence_halls/fletcher_north_and_south_halls/fletcher_exterior_2.jpg", caption : "Fletcher North", showCaption : true },
                    { src : "./images/locations/residence_halls/fletcher_north_and_south_halls/fletcher_interior_1.jpg", caption : "Main Floor Lobby", showCaption : true },
                    { src : "./images/locations/residence_halls/fletcher_north_and_south_halls/fletcher_interior_2.jpg", caption : "Main Floor Lobby", showCaption : true },
                    { src : "./images/locations/residence_halls/fletcher_north_and_south_halls/fletcher_room_2.jpg", caption : "Suite", showCaption : true },
                    { src : "./images/locations/residence_halls/fletcher_north_and_south_halls/fletcher_room_4.jpg", caption : "Suite", showCaption : true },
                    { src : "./images/locations/residence_halls/fletcher_north_and_south_halls/fletcher_room_6.jpg", caption : "Suite Kitchen", showCaption : true },
                    { src : "./images/locations/residence_halls/fletcher_north_and_south_halls/fletcher_room_7.jpg", caption : "Suite Bathroom", showCaption : true },
                    { src : "./images/locations/residence_halls/fletcher_north_and_south_halls/fletcher_volleyball_court.jpg", caption : "Frederick D. (Jr.) Hoppe Volleyball Court by Fletcher North and South Halls", showCaption : true },
                ]
            }
        },

        SECKER_FIELDHOUSE : {
            id : "SECKER_FIELDHOUSE",
            position : {
                lat : 39.734805,
                lng : -91.393480
            }, 
            categories : [
                hlguMapData.categories.Athletics
            ],
            content : {
                name : 'Secker Fieldhouse',
                contentType : hlguMapData.contentTypes.HTML,
                content : "The Secker Fieldhouse was built in 2007. It provides space for HLGU’s wrestling program and training spaces for several outdoor sports.",
                images : [
                    { src : "./images/locations/athletics/secker_fieldhouse/secker_exterior_1.jpg", caption : "Secker Fieldhouse", showCaption : true },
                ]
            }
        },

        QUAD_APARTMENTS : {
            id : "QUAD_APARTMENTS",
            position : {
                lat : 39.734465, 
                lng : -91.390115
            }, 
            categories : [
                hlguMapData.categories.ResidenceHalls
            ],
            content : {
                name : 'Quad Apartments',
                contentType : hlguMapData.contentTypes.HTML,
                content : "The Quad Apartments are on-campus apartment-style housing for upperclassmen male students as well as married students.",
                images : [
                    { src : "./images/locations/residence_halls/quad_apartments/quads_exterior_1.jpg", caption : "Quad Apartments", showCaption : true },
                    { src : "./images/locations/residence_halls/quad_apartments/quads_exterior_2.jpg", caption : "Quad Apartments", showCaption : true },
                ]
            }
        },

        MABEE_SPORTS_COMPLEX : {
            id : "MABEE_SPORTS_COMPLEX",
            position : {
                lat : 39.733205, 
                lng : -91.392440
            }, 
            categories : [
                hlguMapData.categories.Athletics
            ],
            content : {
                name : 'Mabee Sports Complex',
                contentType : hlguMapData.contentTypes.HTML,
                content : "The Mabee Sports Complex holds several courts for use. The blue courts can be used for practices, intramurals, or student activities, while the wooden courts are used for all official indoor athletic events. The athletics offices are in the Mabee Sports Complex as well as several workout rooms for students.",
                images : [
                    { src : "./images/locations/athletics/mabee_sports_complex/msc_exterior_1.jpg", caption : "Mabee Sports Complex", showCaption : true },
                    { src : "./images/locations/athletics/mabee_sports_complex/msc_official_court.jpg", caption : "Trojans Men's Basketball on Official Court", showCaption : true },
                    { src : "./images/locations/athletics/mabee_sports_complex/msc_blue_court_1.jpg", caption : "Blue Courts", showCaption : true },
                    { src : "./images/locations/athletics/mabee_sports_complex/msc_blue_court_2.jpg", caption : "Blue Courts", showCaption : true },
                    { src : "./images/locations/athletics/mabee_sports_complex/msc_cardio_room.jpg", caption : "Cardio Room", showCaption : true },
                    { src : "./images/locations/athletics/mabee_sports_complex/msc_racquetball_court.jpg", caption : "Racquetball Court", showCaption : true },
                    { src : "./images/locations/athletics/mabee_sports_complex/msc_workout_room.jpg", caption : "Workout Room", showCaption : true },
                    { src : "./images/locations/athletics/mabee_sports_complex/msc_weight_room_1.jpg", caption : "Weight Room", showCaption : true },
                    { src : "./images/locations/athletics/mabee_sports_complex/msc_weight_room_2.jpg", caption : "Weight Room", showCaption : true },
                ]
            }
        },

        LEWIS_HALL_BROWN_HALL : {
            id : "LEWIS_HALL_BROWN_HALL",
            position : {
                lat : 39.732700, 
                lng : -91.391250
            }, 
            categories : [
                hlguMapData.categories.ResidenceHalls
            ],
            content : {
                name : 'Lewis Hall/Brown Hall',
                contentType : hlguMapData.contentTypes.HTML,
                content : "Built in 1998 and named after former HLGU Presidents Dr. Larry Lewis and Dr. Paul Brown, Lewis and Brown Halls house women in 94 private rooms. Lewis and Brown are suite style dorms.",
                images : [
                    { src : "./images/locations/residence_halls/lewis_hall_brown_hall/l&b_exterior_1.jpg", caption : "Lewis Hall/Brown Hall", showCaption : true },
                    { src : "./images/locations/residence_halls/lewis_hall_brown_hall/l&b_exterior_2.jpg", caption : "Lewis Hall/Brown Hall", showCaption : true },
                    { src : "./images/locations/residence_halls/lewis_hall_brown_hall/l&b_lobby.jpg", caption : "Main Floor Lobby", showCaption : true },
                    { src : "./images/locations/residence_halls/lewis_hall_brown_hall/l&b_kitchen.jpg", caption : "Community Kitchen", showCaption : true },
                    { src : "./images/locations/residence_halls/lewis_hall_brown_hall/l&b_hallway.jpg", caption : "Hallway", showCaption : true },
                    { src : "./images/locations/residence_halls/lewis_hall_brown_hall/l&b_room_1.jpg", caption : "Suite", showCaption : true },
                    { src : "./images/locations/residence_halls/lewis_hall_brown_hall/l&b_room_2.jpg", caption : "Suite", showCaption : true },
                    { src : "./images/locations/residence_halls/lewis_hall_brown_hall/l&b_room_3.jpg", caption : "Suite", showCaption : true },
                ]
            }
        },

        PARTEE_CENTER_DINING_HALL : {
            id : "PARTEE_CENTER_DINING_HALL",
            position : {
                lat : 39.732560, 
                lng : -91.392260
            }, 
            categories : [
                hlguMapData.categories.FoodAndDining,
                hlguMapData.categories.AcademicsAndOffices
            ],
            content : {
                name : "Partee Center/Dining Hall",
                contentType : hlguMapData.contentTypes.HTML,
                content : "The Partee Center houses the University cafeteria as well as the Page Dining Room. The building also holds the CIS department and has several classrooms and computer labs.",
                images : [
                    { src : "./images/locations/food_and_dining/partee_center_dining_hall/partee_exterior_1.jpg", caption : "Partee Center", showCaption : true },
                    { src : "./images/locations/food_and_dining/partee_center_dining_hall/partee_caf.jpg", caption : "Dining Hall", showCaption : true },
                    { src : "./images/locations/food_and_dining/partee_center_dining_hall/partee_cis_hall.jpg", caption : "Computer Information Systems (CIS) Hallway", showCaption : true },
                    { src : "./images/locations/food_and_dining/partee_center_dining_hall/partee_lab.jpg", caption : "Computer Information Systems (CIS) Lab", showCaption : true },
                    { src : "./images/locations/food_and_dining/partee_center_dining_hall/partee_classroom.jpg", caption : "Classroom", showCaption : true },
                    { src : "./images/locations/food_and_dining/partee_center_dining_hall/partee_exterior_2.jpg", caption : "Outside Patio", showCaption : true },
                ]
            }
        },

        CARROLL_MISSIONS_CENTER : {
            id : "CARROLL_MISSIONS_CENTER",
            position : {
                lat : 39.732310,
                lng : -91.390510
            }, 
            categories : [
                hlguMapData.categories.AcademicsAndOffices
            ],
            content : {
                name : 'Carroll Missions Center',
                contentType : hlguMapData.contentTypes.HTML,
                content : "The Carroll Missions Center houses HLGU’s Christian studies department and has a prayer room along with classrooms. It overlooks a scenic wooded area behind campus.",
                images : [
                    { src : "./images/locations/academics_and_offices/carroll_missions_center/cmc_exterior_1.jpg", caption : "Carroll Missions Center", showCaption : true },
                ]
            }
        },

        CROUCH_HALL : {
            id : "CROUCH_HALL",
            position : {
                lat : 39.731610,
                lng : -91.392620
            }, 
            categories : [
                hlguMapData.categories.ResidenceHalls
            ],
            content : {
                name : 'Crouch Hall',
                contentType : hlguMapData.contentTypes.HTML,
                content : "Crouch is a men’s dormitory built in 1956. It provides housing for 62 students. Each room holds two students. It was renovated in 2020.",
                images : [
                    { src : "./images/locations/residence_halls/crouch_hall/crouch_exterior_1.jpg", caption : "Crouch Hall", showCaption : true },
                    { src : "./images/locations/residence_halls/crouch_hall/crouch_interior_1.jpg", caption : "Main Floor Lobby", showCaption : true },
                ]
            }
        },

        NUUN_COOK_HALL : {
            id : "NUNN_COOK_HALL",
            position : {
                lat : 39.731580,
                lng : -91.391440
            }, 
            categories : [
                hlguMapData.categories.ResidenceHalls
            ],
            content : {
                name : 'Nuun-Cook Hall',
                contentType : hlguMapData.contentTypes.HTML,
                content : "Nunn-Cook is HLGU’s oldest men’s dorm, built in 1929. It provides housing for 74 men. Most rooms are two-person, but there are some three-person rooms on the third floor.",
                images : [
                    { src : "./images/locations/residence_halls/nunn_cook_hall/nunn_cook_exterior_1.jpg", caption : "Nunn-Cook Hall", showCaption : true },
                    { src : "./images/locations/residence_halls/nunn_cook_hall/nunn_cook_exterior_2.jpg", caption : "Nunn-Cook Hall", showCaption : true },
                ]
            }
        },

        BURT_ADMINISTRATION_BUILDING : {
            id : "BURT_ADMINISTRATION_BUILDING",
            position : {
                lat : 39.731195,
                lng : -91.390620
            }, 
            categories : [
                hlguMapData.categories.AcademicsAndOffices
            ],
            content : {
                name : 'Burt Administration Building',
                contentType : hlguMapData.contentTypes.HTML,
                content : "Completed in 1992, the Burt Administration building houses administrative and faculty offices along with classrooms, academic and career services, computer services, a computer lab, the mailroom, and public safety.",
                images : [
                    { src : "./images/locations/academics_and_offices/burt_administration_building/admin_exterior_1.jpg", caption : "Burt Administration Building", showCaption : true },
                    { src : "./images/locations/academics_and_offices/burt_administration_building/admin_exterior_2.jpg", caption : "Burt Administration Building", showCaption : true },
                    { src : "./images/locations/academics_and_offices/burt_administration_building/admin_exterior_3.jpg", caption : "Burt Administration Building", showCaption : true },
                ]
            }
        },

        PUBLIC_SAFETY : {
            id : "PUBLIC_SAFETY",
            position : {
                lat : 39.731245,
                lng : -91.390810
            }, 
            categories : [
                hlguMapData.categories.PointsOfInterest
            ],
            content : {
                name : 'Public Safety',
                contentType : hlguMapData.contentTypes.HTML,
                content : "The public safety office is located on the first floor of the Burt Administration Building and is manned 24/7. Students will go here to get their parking permit, student IDs, and check the lost and found. You can contact HLGU’s Department of Public Safety at 573-248-6268.",
                images : [
                    { src : "./images/locations/points_of_interest/public_safety/public_safety.jpg", caption : "Public Safety", showCaption : true },
                ]
            }
        },

        CARROLL_SCIENCE_CENTER : {
            id : "CARROLL_SCIENCE_CENTER",
            position : {
                lat : 39.730990,
                lng : -91.392840
            }, 
            categories : [
                hlguMapData.categories.AcademicsAndOffices
            ],
            content : {
                name : 'Carroll Science Center',
                contentType : hlguMapData.contentTypes.HTML,
                content : "Built in 2015 as the newest building on campus, the Carroll Science Center houses all nursing, science, and mathematics courses and labs. The building has state-of-the art facilities for the training of RNs and LPNs.",
                images : [
                    { src : "./images/locations/academics_and_offices/carroll_science_center/csc_exterior_1.jpg", caption : "Carroll Science Center", showCaption : true },
                ]
            }
        },

        HLGU_CAMPUS_STORE : {
            id : "HLGU_CAMPUS_STORE",
            position : {
                lat : 39.730840,
                lng : -91.391310
            }, 
            categories : [
                hlguMapData.categories.PointsOfInterest
            ],
            content : {
                name : 'HLGU Campus Store',
                contentType : hlguMapData.contentTypes.HTML,
                content : "The HLGU Campus Store is the one-stop shop for all things HLGU, from apparel to coffee mugs. The Campus Store also is where students can buy their textbooks and supplies for classes. Learn more about the HLGU Campus Store <a href='https://www.hlg.edu/student-life/campus-store/' target='_blank'>here</a>.",
                images : [
                    { src : "./images/locations/points_of_interest/hlgu_campus_store/stuc_campus_store_1.jpg", caption : "HLGU Campus Store", showCaption : true },
                    { src : "./images/locations/points_of_interest/hlgu_campus_store/stuc_campus_store_2.jpg", caption : "HLGU Campus Store", showCaption : true },
                ]
            }
        },

        THE_HLGU_LOFT : {
            id : "THE_HLGU_LOFT",
            position : {
                lat : 39.730805,
                lng : -91.391500
            }, 
            categories : [
                hlguMapData.categories.FoodAndDining
            ],
            content : {
                name : 'The HLGU Loft',
                contentType : hlguMapData.contentTypes.HTML,
                content : "The Loft is located upstairs in the L.A. Foster Student Center. The coffee shop in The Loft serves Starbucks coffee for purchase, and features the Sub Shop as a meal swap option for students. The space is designed for students to relax and have fun, but is also good for studying as necessary.",
                images : [
                    { src : "./images/locations/food_and_dining/the_hlgu_loft/stuc_interior_1.jpg", caption : "The HLGU Loft", showCaption : true },
                ]
            }
        },

        LA_FOSTER_STUDENT_CENTER : {
            id : "LA_FOSTER_STUDENT_CENTER",
            position : {
                lat : 39.730695,
                lng : -91.391370
            }, 
            categories : [
                hlguMapData.categories.PointsOfInterest,
                hlguMapData.categories.AcademicsAndOffices
            ],
            content : {
                name : 'L.A. Foster Student Center',
                contentType : hlguMapData.contentTypes.HTML,
                content : "The L.A. Foster Student Center was built in 1966 originally as the campus library. The student center houses the HLGU Campus Store, the Sub Shop, and the Loft. It also houses the offices of student life and Christian ministry and missions. The building was renovated in summer of 2017.",
                images : [
                    { src : "./images/locations/points_of_interest/la_foster_student_center/stuc_exterior_1.jpg", caption : "L.A. Foster Student Center", showCaption : true },
                    { src : "./images/locations/points_of_interest/la_foster_student_center/stuc_interior_1.jpg", caption : "L.A. Foster Student Center", showCaption : true },
                    { src : "./images/locations/points_of_interest/la_foster_student_center/stuc_interior_2.jpg", caption : "L.A. Foster Student Center", showCaption : true },
                    { src : "./images/locations/points_of_interest/la_foster_student_center/stuc_campus_store_1.jpg", caption : "HLGU Campus Store", showCaption : true },
                    { src : "./images/locations/points_of_interest/la_foster_student_center/stuc_campus_store_2.jpg", caption : "HLGU Campus Store", showCaption : true },
                    { src : "./images/locations/points_of_interest/la_foster_student_center/stuc_student_life_office.jpg", caption : "Student Life Office", showCaption : true },
                ]
            }
        },

        MARY_WIEHE_BUILDING : {
            id : "MARY_WIEHE_BUILDING",
            position : {
                lat : 39.730750, 
                lng : -91.389995
            }, 
            categories : [
                hlguMapData.categories.ResidenceHalls
            ],
            content : {
                name : 'Mary Wiehe Building',
                contentType : hlguMapData.contentTypes.HTML,
                content : "The Mary Wiehe Building provides housing for 12 students on campus.",
                images : [
                    { src : "./images/locations/residence_halls/mary_wiehe_building/wiehe_exterior_1.jpg", caption : "Mary Wiehe Building", showCaption : true },
                    { src : "./images/locations/residence_halls/mary_wiehe_building/wiehe_interior_1.jpg", caption : "Lobby", showCaption : true },
                    { src : "./images/locations/residence_halls/mary_wiehe_building/wiehe_room_1.jpg", caption : "Dormitory", showCaption : true },
                    { src : "./images/locations/residence_halls/mary_wiehe_building/wiehe_room_2.jpg", caption : "Dormitory", showCaption : true },
                    { src : "./images/locations/residence_halls/mary_wiehe_building/wiehe_bathroom.jpg", caption : "Bathroom", showCaption : true },
                ]
            }
        },

        PULLIAM_HALL : {
            id : "PULLIAM_HALL",
            position : {
                lat : 39.730275, 
                lng : -91.390060
            }, 
            categories : [
                hlguMapData.categories.ResidenceHalls
            ],
            content : {
                name : 'Pulliam Hall',
                contentType : hlguMapData.contentTypes.HTML,
                content : "Pulliam Hall was HLGU’s first women’s dormitory, built in 1929. The building provides housing for 74 female students. Most rooms in Pulliam Hall are two-person rooms, but there are a few three-person rooms upstairs.",
                images : [
                    { src : "./images/locations/residence_halls/pulliam_hall/pulliam_exterior_1.jpg", caption : "Pulliam Hall", showCaption : true },
                    { src : "./images/locations/residence_halls/pulliam_hall/pulliam_exterior_2.jpg", caption : "Pulliam Hall", showCaption : true },
                    { src : "./images/locations/residence_halls/pulliam_hall/pulliam_exterior_3.jpg", caption : "Pulliam Hall", showCaption : true },
                ]
            }
        },

        KLECKNER_HALL : {
            id : "KLECKNER_HALL",
            position : {
                lat : 39.729970, 
                lng : -91.390435
            }, 
            categories : [
                hlguMapData.categories.ResidenceHalls
            ],
            content : {
                name : 'Kleckner Hall',
                contentType : hlguMapData.contentTypes.HTML,
                content : "Kleckner Hall was built in 1962 and houses 52 women. It’s home to the largest kitchen for student use on campus. Kleckner was renovated in 2017 with new bathrooms, new air conditioning and heating in each room, and updated lobbies.",
                images : [
                    { src : "./images/locations/residence_halls/kleckner_hall/kleckner_exterior_1.jpg", caption : "Kleckner Hall", showCaption : true },
                    { src : "./images/locations/residence_halls/kleckner_hall/kleckner_interior_1.jpg", caption : "Upstairs Lobby", showCaption : true },
                    { src : "./images/locations/residence_halls/kleckner_hall/kleckner_room_1.jpg", caption : "Dormitory", showCaption : true },
                    { src : "./images/locations/residence_halls/kleckner_hall/kleckner_room_2.jpg", caption : "Dormitory", showCaption : true },
                    { src : "./images/locations/residence_halls/kleckner_hall/kleckner_hallway.jpg", caption : "Hallway", showCaption : true },
                    { src : "./images/locations/residence_halls/kleckner_hall/kleckner_bathroom.jpg", caption : "Bathroom", showCaption : true },
                ]
            }
        },
        
        HAGERMAN_ART_GALLERY : {
            id : "HAGERMAN_ART_GALLERY",
            position : {
                lat : 39.730000,
                lng : -91.392000
            }, 
            categories : [
                hlguMapData.categories.PointsOfInterest
            ],
            content : {
                name : 'Hagerman Art Gallery',
                contentType : hlguMapData.contentTypes.HTML,
                content : "The Hagerman Art Gallery, located in the Roland Fine Arts Center, showcases local artists and student art throughout the year.",
                images : [
                    { src : "./images/locations/points_of_interest/hagerman_art_gallery/rfac_hagerman_art_gallery.jpg", caption : "Hagerman Art Gallery", showCaption : true },
                ]
            }
        },
        
        ROLAND_FINE_ARTS_CENTER : {
            id : "ROLAND_FINE_ARTS_CENTER",
            position : {
                lat : 39.729860,
                lng : -91.392110
            }, 
            categories : [
                hlguMapData.categories.AcademicsAndOffices
            ],
            content : {
                name : 'Roland Fine Arts Center',
                contentType : hlguMapData.contentTypes.HTML,
                content : "The Roland Fine Arts Center was built in 2003. It houses the art, theatre, music, and communication departments. It holds the Parker Theatre, along with the Hagerman Art Gallery.",
                images : [
                    { src : "./images/locations/academics_and_offices/roland_fine_arts_center/rfac_exterior_1.jpg", caption : "Roland Fine Arts Center", showCaption : true },
                    { src : "./images/locations/academics_and_offices/roland_fine_arts_center/rfac_interior_1.jpg", caption : "Roland Fine Arts Center", showCaption : true },
                    { src : "./images/locations/academics_and_offices/roland_fine_arts_center/rfac_hagerman_art_gallery.jpg", caption : "Hagerman Art Gallery", showCaption : true },
                    { src : "./images/locations/academics_and_offices/roland_fine_arts_center/rfac_art_hall.jpg", caption : "Art Hallway", showCaption : true },
                    { src : "./images/locations/academics_and_offices/roland_fine_arts_center/rfac_computer_lab.jpg", caption : "Art Computer Lab", showCaption : true },
                    { src : "./images/locations/academics_and_offices/roland_fine_arts_center/rfac_theatre_1.jpg", caption : "Parker Theatre", showCaption : true },
                    { src : "./images/locations/academics_and_offices/roland_fine_arts_center/rfac_theatre_2.jpg", caption : "Parker Theatre", showCaption : true },
                    { src : "./images/locations/academics_and_offices/roland_fine_arts_center/rfac_music_hall.jpg", caption : "Music Hallway", showCaption : true },
                    { src : "./images/locations/academics_and_offices/roland_fine_arts_center/rfac_media_com.jpg", caption : "Media Communications Lab", showCaption : true },
                ]
            }
        },
        
        PARKER_THEATRE : {
            id : "PARKER_THEATRE",
            position : {
                lat : 39.729730,
                lng : -91.392260
            }, 
            categories : [
                hlguMapData.categories.PointsOfInterest
            ],
            content : {
                name : 'Parker Theatre',
                contentType : hlguMapData.contentTypes.HTML,
                content : "Parker Theatre, located in the Roland Fine Arts Center, is an auditorium that seats over 500 people. Campus concerts, theatre productions, a variety of events and activities, and weekly chapel are all conducted in Parker Theatre.",
                images : [
                    { src : "./images/locations/academics_and_offices/roland_fine_arts_center/rfac_theatre_1.jpg", caption : "Parker Theatre", showCaption : true },
                    { src : "./images/locations/academics_and_offices/roland_fine_arts_center/rfac_theatre_2.jpg", caption : "Parker Theatre", showCaption : true },
                ]
            }
        },

        PULLIAM_STREET_APARTMENTS : {
            id : "PULLIAM_STREET_APARTMENTS",
            position : {
                lat : 39.729700, 
                lng : -91.389240
            }, 
            categories : [
                hlguMapData.categories.ResidenceHalls
            ],
            content : {
                name : 'Pulliam Street Apartments',
                contentType : hlguMapData.contentTypes.HTML,
                content : "The Pulliam Street Apartments are on-campus apartment-style housing for upperclassmen female students.",
                images : [
                    { src : "./images/locations/residence_halls/pulliam_street_apartments/psa_exterior_1.jpg", caption : "Pulliam Street Apartments", showCaption : true },
                ]
            }
        },

        PRINCE_HOUSE : {
            id : "PRINCE_HOUSE",
            position : {
                lat : 39.729490,
                lng : -91.389760
            }, 
            categories : [
                hlguMapData.categories.PointsOfInterest
            ],
            content : {
                name : 'Prince House',
                contentType : hlguMapData.contentTypes.HTML,
                content : "The Prince House is a home located just northeast of the Roland Library. It was originally built as the president’s home and has served a number of roles over the years.",
                images : [
                    { src : "./images/locations/points_of_interest/prince_house/prince_house_exterior_1.jpg", caption : "Prince House", showCaption : true },
                    { src : "./images/locations/points_of_interest/prince_house/prince_house_exterior_2.jpg", caption : "Prince House", showCaption : true },
                ]
            }
        },

        ROLAND_LIBRARY : {
            id : "ROLAND_LIBRARY",
            position : {
                lat : 39.729050,
                lng : -91.391050
            }, 
            categories : [
                hlguMapData.categories.PointsOfInterest
            ],
            content : {
                name : 'Roland Library',
                contentType : hlguMapData.contentTypes.HTML,
                content : "The Roland Library was completed in spring of 2012. Intended to be a non-traditional library, it serves as a social and relaxed environment for students to come and work together or individually. Library services include printing, online databases, computer access, study rooms (individual and group), and print resources.",
                images : [
                    { src : "./images/locations/points_of_interest/roland_library/library_exterior_1.jpg", caption : "Roland Library", showCaption : true },
                    { src : "./images/locations/points_of_interest/roland_library/library_interior_1.jpg", caption : "Roland Library", showCaption : true },
                    { src : "./images/locations/points_of_interest/roland_library/library_interior_2.jpg", caption : "Roland Library", showCaption : true },
                    { src : "./images/locations/points_of_interest/roland_library/library_hall_left.jpg", caption : "Roland Library", showCaption : true },
                    { src : "./images/locations/points_of_interest/roland_library/library_hall_right.jpg", caption : "Roland Library", showCaption : true },
                    { src : "./images/locations/points_of_interest/roland_library/library_writing_center.jpg", caption : "Writing Lab", showCaption : true },
                    { src : "./images/locations/points_of_interest/roland_library/library_computer_lab.jpg", caption : "Computer Lab", showCaption : true },
                ]
            }
        },

        /* insert new locations here, if desired */

    };
    
    /* insert 360 views sections if desired */

    // hlguMapData.markers.LAB = {
    //     id : "LAB",
	// 	hidden : false,
    //     position : {
    //         lat : 39.732560, 
    //         lng : -91.392260
    //     },
    //     categories : [
    //         hlguMapData.categories.Views360
    //     ],
    //     content : {
    //         name : "Computer Information Systems Lab",
    //         contentType : hlguMapData.contentTypes.Photo360,
    //         content : "./images/360lab.jpg"
    //     }
    // };

    // hlguMapData.markers.PARTEE_CENTER_DINING_HALL.content.views360 = [
    //     {
    //        title : "Computer Information Systems Lab",
    //        items : [
    //            hlguMapData.markers.LAB
    //        ]
    //     }
    // ];
	
    /* Define Icons for Categories */

    hlguMapData.icons = {
        PointsOfInterest : {
            normal : {
                url : "images/icons/markers/PointsOfInterest.svg",
				optimized: false,
                size : {
                    width : 110.76,
                    height : 150
                },
                scaledSize : {
                    width : 27.75,
                    height : 37.5
                },
                origin : {
                    x : 0,
                    y : 0
                },
                anchor: {
                    x : 13.875,
                    y : 33.75
                }
            },
            active : {
                url : "images/icons/markers/PointsOfInterest.svg",
				optimized: false,
                size : {
                    width : 110.76,
                    height : 150
                },
                scaledSize : {
                    width : 44.4,
                    height : 60
                },
                origin : {
                    x : 0,
                    y : 0
                },
                anchor: {
                    x : 22.2,
                    y : 54
                }
            }
        },
        AcademicsAndOffices : {
            normal : {
                url : "images/icons/markers/AcademicsAndOffices.svg",
				optimized: false,
                size : {
                    width : 110.76,
                    height : 150
                },
                scaledSize : {
                    width : 27.75,
                    height : 37.5
                },
                origin : {
                    x : 0,
                    y : 0
                },
                anchor: {
                    x : 13.875,
                    y : 33.75
                }
            },
            active : {
                url : "images/icons/markers/AcademicsAndOffices.svg",
				optimized: false,
                size : {
                    width : 110.76,
                    height : 150
                },
                scaledSize : {
                    width : 44.4,
                    height : 60
                },
                origin : {
                    x : 0,
                    y : 0
                },
                anchor: {
                    x : 22.2,
                    y : 54
                }
            }
        },
        Athletics : {
            normal : {
                url : "images/icons/markers/Athletics.svg",
				optimized: false,
                size : {
                    width : 110.76,
                    height : 150
                },
                scaledSize : {
                    width : 27.75,
                    height : 37.5
                },
                origin : {
                    x : 0,
                    y : 0
                },
                anchor: {
                    x : 13.875,
                    y : 33.75
                }
            },
            active : {
                url : "images/icons/markers/Athletics.svg",
				optimized: false,
                size : {
                    width : 110.76,
                    height : 150
                },
                scaledSize : {
                    width : 44.4,
                    height : 60
                },
                origin : {
                    x : 0,
                    y : 0
                },
                anchor: {
                    x : 22.2,
                    y : 54
                }
            }
        },
        FoodAndDining : {
            normal : {
                url : "images/icons/markers/FoodAndDining.svg",
				optimized: false,
                size : {
                    width : 110.76,
                    height : 150
                },
                scaledSize : {
                    width : 27.75,
                    height : 37.5
                },
                origin : {
                    x : 0,
                    y : 0
                },
                anchor: {
                    x : 13.875,
                    y : 33.75
                }
            },
            active : {
                url : "images/icons/markers/FoodAndDining.svg",
				optimized: false,
                size : {
                    width : 110.76,
                    height : 150
                },
                scaledSize : {
                    width : 44.4,
                    height : 60
                },
                origin : {
                    x : 0,
                    y : 0
                },
                anchor: {
                    x : 22.2,
                    y : 54
                }
            }
        },
        ResidenceHalls : {
            normal : {
                url : "images/icons/markers/ResidenceHalls.svg",
				optimized: false,
                size : {
                    width : 110.76,
                    height : 150
                },
                scaledSize : {
                    width : 27.75,
                    height : 37.5
                },
                origin : {
                    x : 0,
                    y : 0
                },
                anchor: {
                    x : 13.875,
                    y : 33.75
                }
            },
            active : {
                url : "images/icons/markers/ResidenceHalls.svg",
				optimized: false,
                size : {
                    width : 110.76,
                    height : 150
                },
                scaledSize : {
                    width : 44.4,
                    height : 60
                },
                origin : {
                    x : 0,
                    y : 0
                },
                anchor: {
                    x : 22.2,
                    y : 54
                }
            }
        },
        Views360 : {
            normal : {
                url : "images/icons/markers/360Views.svg",
				optimized: false,
                size : {
                    width : 110.76,
                    height : 150
                },
                scaledSize : {
                    width : 44.4,
                    height : 60
                },
                origin : {
                    x : 0,
                    y : 0
                },
                anchor: {
                    x : 22.2,
                    y : 54
                }
            },
            active : {
                url : "images/icons/markers/360Views.svg",
				optimized: false,
                size : {
                    width : 110.76,
                    height : 150
                },
                scaledSize : {
                    width : 44.4,
                    height : 60
                },
                origin : {
                    x : 0,
                    y : 0
                },
                anchor: {
                    x : 22.2,
                    y : 54
                }
            }
        }
    };

    navigationView = (function ($) {

        var methods = {}, assets = {}, settings = {};

        $(function () {
            assets.mapContainer = $("#map");
            assets.menuBtn = $("#menu").on('click', methods.toggleMenuVisibility);
            assets.sidebar = assets.mapContainer.find("aside");
            assets.homeBtn = assets.mapContainer.find("#home");
            assets.closeBtn = assets.mapContainer.find('.map-button.close');
            
            assets.closeBtnFull = assets.mapContainer.find('#container-small .map-button.close');
            assets.closeBtnSmall = assets.mapContainer.find('#container-small .map-button.close');
			
			assets.searchInput = $('#search');
        });

        methods.populateMenuCategories = function (categories, changeEvent, callback) {
            callback = callback || function () {};
            
            $(function () {

                assets.categoryList = assets.categoryList || $("<ul></ul>").attr("id", "category-filter");
                assets.categoryList.html('');

                $.each(categories, function (key, category) {
                    var li, checkbox, label, div, arrow;
                    
                    div = $("<div></div>");
                    
                    li = $("<li></li>").addClass("category");
                    
                    arrow = $("<a></a>").addClass('arrow');
                    
                    checkbox = $('<input type="checkbox" />').attr('name', key + '-checkbox').attr('id', key + '-checkbox').attr("data-map-category", key);
                    label = $('<label></label').attr('for', key + '-checkbox').text(category);
                    
                    assets.categoryList.append(li.append(arrow).append(checkbox).append(label));
                    
                    checkbox.on('change', methods.categoryDidToggleVisibility);
                });

                assets.sidebar.find('.nav-content').append(assets.categoryList);
                assets.categoryCheckboxes = assets.categoryList.find('input[type=checkbox]').prop('checked', true);
                
                if (changeEvent) {
                    assets.categoryCheckboxes.on('change', changeEvent);
                }
                assets.categoryArrows = assets.categoryList.find('a.arrow');
                assets.categoryMarkers = assets.categoryList.find('.markers');
                
                assets.categoryArrows.on('click', function () {
                    var object = $(this), markers, otherMarkers;
                    
                    markers = object.siblings('.markers').first();
                    
                    otherMarkers = assets.categoryList.find('.markers').filter(":visible").not(markers);
                    
                    assets.categoryArrows.removeClass('open');
                    
                    if (markers.is(":visible")) {
                        markers.slideUp(250);
                        object.removeClass('open');
                    } else {
                        markers.slideDown(250);
                        object.addClass('open');
                        otherMarkers.slideUp(250);
                        
                        if (object.siblings('input[type=checkbox]').first().prop("checked") === false) {
                            object.siblings('label').first().trigger('click');
                        }
                    }
                });
            
                callback();
            });
        };
        
        methods.addLocationToCategory = function (name, id, category) {
            var label, itemList;
            
            label = $('label[for=' + category + '-checkbox]');
            itemList = $('label[for=' + category + '-checkbox]').next('div.markers');
            
            if (!itemList.length) {
                itemList = $('<div></div>').addClass('markers').append("<ol></ol>");
                label.after(itemList);
            }
            
            itemList.find("ol").append($('<li></li>').text(name).attr('data-marker-id', id));
        };
        
        methods.categoryDidToggleVisibility = function () {
            var sender = $(this);
            
            if (!sender.prop("checked")) {
                sender.siblings(".arrow.open").first().trigger("click");
            }
        };
        
        methods.getActiveCategories = function () {
            var activeCategories = [];
            
            $.each(assets.categoryCheckboxes, function (i, category) {
                category = $(category);
                
                if (category.prop('checked')) {
                    activeCategories.push(category.attr('data-map-category'));
                }
            });
            
            return activeCategories;
        };

        methods.toggleMenuVisibility = function () {
            methods.showMenu(!assets.mapContainer.hasClass("show-menu"));
        };

        methods.showMenu = function (show) {
            show = (show === false) ? show : true;

            if (show) {
                assets.mapContainer.addClass("show-menu");
            } else {
                assets.mapContainer.removeClass("show-menu");
            }
        };

        return {
            populateMenuCategories : function (categories, changeEvent, callback) { methods.populateMenuCategories(categories, changeEvent, callback); return this; },
            addLocationToCategory : function (name, id, category) { methods.addLocationToCategory(name, id, category); return this; },
            getAssets : function () { return assets; },
            getActiveCategories : function () { return methods.getActiveCategories(); },
            showMenu : function (show) { methods.showMenu(show); return this; }
        };
    }(jQuery));
    
    mapView = (function () {
        var enums = {}, methods = {}, defaultSettings = {}, markers = {}, initialLocation = {}, bounds;
        
        enums.mapStyles = {
            hybrid : "hybrid",
            satellite : "satellite",
            terrain : "terrain",
            roadmap : "roadmap"
        };
        
        methods.initializeMap = function (id, zoom, lat, lng, settings) {
            id = id || "map";
            settings = settings || {};
            
            initialLocation.zoom = 18;
            initialLocation.lat = lat;
            initialLocation.lng = lng;
            
            googleMap = new google.maps.Map(document.getElementById(id), {
                zoom: initialLocation.zoom,
                center: {
                    lat: lat,
                    lng: lng
                },
                tilt: 0,
                mapTypeId : enums.mapStyles.terrain,
                zoomControl : true,
                zoomControlOptions: {
                    position: google.maps.ControlPosition.TOP_RIGHT
                },
                streetViewControl : false,
                streetViewControlOptions: {
                    position: google.maps.ControlPosition.TOP_RIGHT
                },
                scrollwheel : false,
                panControl : true,
                scaleControl : true,
                rotateControl : false,
                overviewMapControl : false,
                mapTypeControl : false,
                draggable : true,
                disableDoubleClickZoom : true,
                controlPosition : google.maps.ControlPosition.TOP_CENTER,
                styles : settings
            });
            
            methods.addOverlay();
        };
        
        methods.setMarkers = function (markerList, events) {
            var markersArray = [];
            
            events = events || [];
            
            $.each(markerList, function (id, data) {
                var markerObject = methods.createMarker(data.position);
                
                markerObject.set('identifier', id);
                
                markers[id] = markerObject;
                
                markersArray.push(markerObject);
                
                events.forEach(function (event) {
                    markerObject.addListener(event.event, event.target);
                });
                
                markerObject.addListener("mouseover", function () {
                    this.setZIndex(google.maps.Marker.MAX_ZINDEX + 1);
                });
                markerObject.addListener("mouseout", function () {
                    this.setZIndex();
                });
            });
        };
        
        methods.createMarker = function (position) {
            var marker = new google.maps.Marker({
                position : {
                    lat: position.lat,
                    lng: position.lng
                },
                //animation: google.maps.Animation.DROP,
                clickable : true
            });
        
            return marker;
        };
        
        methods.updateMarkers = function (markerArray, animated) {
            animated = animated || false;
            
            var markersToDrop = [];
            markerArray.forEach(function (markerData) {
                if (markerData.hidden !== true) {
                    var marker = markers[markerData.id];
					
					if (!hlguIsIE()) {
                    	marker.setIcon(markerData.icons.normal);
					}

                    if (!markerData.show) {
                        marker.setMap(null);
                    } else if (!marker.getMap()) {
                        markersToDrop.push(marker);
                    }
                }
            });
            
            methods.dropInMarkers(markersToDrop, animated);
        };
        
        methods.setMarkerIcon = function (markerId, icon) {
            markers[markerId].setIcon(icon);
        };
        
        methods.dropInMarkers = function (markersArray, animated, interval, delay) {
            var dropInMarker;
            
            
            if (animated) {
                interval = interval || (1000 / markersArray.length);
                delay = delay || 0;

                dropInMarker = function () {
                    var index = parseInt(Math.random() * markersArray.length, 10), markerObject;

                    markerObject = markersArray[index];

                    markerObject.setMap(googleMap);
                    markerObject.setAnimation(google.maps.Animation.DROP);

                    markersArray.splice(index, 1);

                    if (markersArray.length) {
                        setTimeout(dropInMarker, interval);
                    }
                };

                dropInMarker();
            } else {
                markersArray.forEach(function (markerObject, i) {
                    markerObject.setMap(googleMap);
                });
            }
        };
        
        methods.returnToCenter = function () {
            google.maps.event.trigger(googleMap, "resize");
            googleMap.setZoom(initialLocation.zoom);
            googleMap.panTo({ lat : initialLocation.lat, lng : initialLocation.lng});
        };
        
        methods.panToWithOffset = function (position, offsetX, offsetY) {
            offsetX = offsetX || 0;
            offsetX = -offsetX;
            
            offsetY = offsetY || 0;
            
            googleMap.panToWithOffset(position, offsetX, offsetY);
        };
        
        methods.addOverlay = function (url) {
            var overlay, hlguOverlay, srcImage;
            
            hlguOverlay = function (bounds, image, map) {
                this.bounds = bounds;
                this.image = image;
                this.map = map;
                
                this.div = null;
                
                this.setMap(map);
            };
            
            hlguOverlay.prototype = new google.maps.OverlayView();

            /* Increasing the latitude value moves the boundary northward; increasing the longitude value (closer to 0) moves the boundary eastward. */
            bounds = new google.maps.LatLngBounds(
                new google.maps.LatLng(39.727255, -91.395940),  // SW Boundary
                new google.maps.LatLng(39.735625, -91.386650)   // NE Boundary
            );

            /* This is the map overlay. */
            srcImage = './images/map.svg'                       // 823.55px * 487.16px

            overlay = new hlguOverlay(bounds, srcImage, googleMap);

            hlguOverlay.prototype.onAdd = function () {

                var div = document.createElement('div'), img, panes;
                div.style.borderStyle = 'none';
                div.style.borderWidth = '0px';
                div.style.position = 'absolute';

                // Create the img element and attach it to the div.
                img = document.createElement('img');
                img.src = this.image;
                img.style.width = '100%';
                img.style.height = '100%';
                img.style.position = 'absolute';
                div.appendChild(img);

                this.div = div;

                // Add the element to the "overlayLayer" pane.
                panes = this.getPanes();
                panes.overlayLayer.appendChild(div);
            };
            
            hlguOverlay.prototype.draw = function () {

                // We use the south-west and north-east
                // coordinates of the overlay to peg it to the correct position and size.
                // To do this, we need to retrieve the projection from the overlay.
                var overlayProjection = this.getProjection(), sw, ne, div;

                // Retrieve the south-west and north-east coordinates of this overlay
                // in LatLngs and convert them to pixel coordinates.
                // We'll use these coordinates to resize the div.
                sw = overlayProjection.fromLatLngToDivPixel(this.bounds.getSouthWest());
                ne = overlayProjection.fromLatLngToDivPixel(this.bounds.getNorthEast());

                // Resize the image's div to fit the indicated dimensions.
                div = this.div;
                div.style.left = sw.x + 'px';
                div.style.top = ne.y + 'px';
                div.style.width = (ne.x - sw.x) + 'px';
                div.style.height = (sw.y - ne.y) + 'px';
            };

            // The onRemove() method will be called automatically from the API if
            // we ever set the overlay's map property to 'null'.
            hlguOverlay.prototype.onRemove = function () {
                this.div.parentNode.removeChild(this.div);
                this.div = null;
            };
        };
        
        methods.showMarkerById = function (id) {
            
            var marker = markers[id];
            
            google.maps.event.trigger(marker, "click");
        };
        
        methods.enableLocationTracker = function (button, bounds) {
            var addLocation, updateLocation, marker, location, fitsBounds;
            
            updateLocation = function (position) {
                
                if (!marker) {
                    marker = addLocation(position);
                }
                
                location = new google.maps.LatLng(position.coords.latitude, position.coords.longitude);
                
                marker.setPosition(location);
                
                fitsBounds = (bounds) ? bounds.contains(location) : true;
                //fitsBounds = true;
                
                if (fitsBounds && !button.hasClass('visible')) {
                    button.addClass('visible').fadeIn(200);
                } else if (!fitsBounds && button.hasClass('visible')) {
                    button.removeClass('visible').fadeOut(200);
                }
            };
            
            navigator.geolocation.getCurrentPosition(updateLocation);
            navigator.geolocation.watchPosition(updateLocation);
            
            addLocation = function (position) {
                return new google.maps.Marker({
                    icon : {
                        url : "images/icons/markers/Location_Icon.svg",
                        scaledSize : {
                            width : 40,
                            height : 40
                        },
                        origin : {
                            x : 0,
                            y : 0
                        },
                        anchor: {
                            x : 20,
                            y : 20
                        }
                    },
                    zIndex : 1,
                    clickable : false,
                    map : googleMap
                });
            };
            
            if (button) {
                button.on('click', function () {
                    mapView.panTo(location);
                });
            }
        };
            
        methods.isWithinBounds = function (point, bounds) {

        };
        
        return {
            initializeMap : function (id, zoom, lat, lng, settings) { methods.initializeMap(id, zoom, lat, lng, settings); return this; },
            setMarkers : function (markers, events) { methods.setMarkers(markers, events); return this; },
            updateMarkers : function (markerArray) { methods.updateMarkers(markerArray); },
            setMarkerIcon : function (markerId, icon) { methods.setMarkerIcon(markerId, icon); return this; },
            returnToCenter : function () { methods.returnToCenter(); return this; },
            panTo : function (position, offsetX, offsetY) { methods.panToWithOffset(position, offsetX, offsetY); return this; },
            showMarkerById : function (id) { methods.showMarkerById(id); return this; },
            enableLocationTracker : function (button, bounds) { methods.enableLocationTracker(button, bounds); return this; }
        };
    }());
    
    contentView = (function ($) {
        var assets = {}, methods = {}, enums = {}, fullScreenFunctions = {};
        
        $(function () {
            assets.mapContainer = $('#map');
            assets.containerFull = $('#container-full');
            assets.containerSmall = $('#container-small');
        });
        
        methods.createNewContainerFull = function (id) {
            assets.containerFull.append($('<div></div>').attr('id', id));
        };
        
        methods.closeContent = function (type) {
            var status = assets.mapContainer.attr('data-map-status');
            
            methods.exitFullScreen();
            
            assets.containerFull.find('iframe').remove();
            assets.mapContainer.removeClass('show-content');
            assets.mapContainer.attr('data-map-status', '');
            
            if (status === enums.layouts.sidePanel) {
                setTimeout(methods.clearContent, 200);
            } else {
                methods.clearContent();
            }
        };
        
        methods.updateSideContent = function (name, content) {
            var header, gallery, backBtn, nextBtn, childList, container, container2;
            
            assets.containerSmall.children('*').not('.map-button').remove();
            
            container = $('<div></div>').addClass('scroll-fix');
            assets.containerSmall.append(container);
            
            container2 = $('<div></div>').addClass('container');
            container.append(container2);
            container = container2;
            
            container.append($('<h3></h3>').text(content.name));
            
            if (content.videoID) {
                container.append($("<div></div>").addClass('video').append($("<div></div>").attr('id', 'video-'  + content.videoID)));
                youtubeController.embedSideContentVideo(content.videoID, 'video-'  + content.videoID);
            } else if (content.images && content.images.length) {
                gallery = $("<div></div>").addClass('gallery');
                
                content.images.forEach(function (imageData, i) {
                    var figure = $("<figure></figure>"), caption;
                    caption = $("<figcaption></figcaption>").html(imageData.caption);
                    
                    if (imageData.showCaption === false) {
                        caption.css("display", "none");
                    }
                    
                    figure.append($("<img />").attr('src', imageData.src)).append(caption);
                    
                    if (!i) {
                        figure.addClass('current');
                    } else {
                        figure.hide();
                    }
                    
                    gallery.append(figure);
                });
                
                container.append(gallery);
                
                if (content.images.length >= 2) {
                    backBtn = $('<a></a>').addClass('button').addClass('back');
                    nextBtn = backBtn.clone().removeClass('back').addClass('next');
                    gallery.append(backBtn).append(nextBtn);
                    
                    methods.slideshow.enableButtons(true);
                }
            }
            
            if (content.content) {
                container.append($('<div></div>').addClass('content').html(content.content));
            }
                
            if (enable360 && content.views360 && content.views360.length) {
                childList = methods.createChildList(content.views360);

                if (childList) {
                    container.append(childList);
                }

            }
            
            container.css('z-index', 10);
            container.css('z-index');
            container.css('z-index', '');
            
            container.on('mouseover', function () {
                container.css('display', 'none');
                container.css('display');
                container.css('display', '');
                
                container.off('mouseover');
            });
        };
        
        methods.createChildList = function (children) {
            var list = $("<dl></dl>"), shouldAppend = false;
            
            children.forEach(function (category) {
                var title = $("<dt><span class='title-360'></span>" + category.title + "</dt>"), appended = false;
                
                if (category.items && category.items.length) {
                    category.items.forEach(function (item) {
                        var content = item.content;
                        
                        if (content) {
                            if (!appended) {
                                list.append(title);
                                appended = true;
                                shouldAppend = true;
                            }
                            
                            list.append($("<dd>" + content.name + "</dd>").attr('data-marker-id', item.id));
                        }
                    });
                }
            });
            
            if (shouldAppend) {
                return list;
            } else {
                return false;
            }
        };
        
        methods.clearContent = function () {
            assets.containerSmall.children('*').not('.map-button').remove();
        };
        
        methods.slideshow = {};
        
        methods.slideshow.showNextPhoto = function () {
            var slideshow, current, next;
            
            slideshow = methods.slideshow.getSlideshow();
            current = slideshow.find('figure.current').removeClass('current');
            
            next = current.next('figure');
            
            methods.slideshow.enableButtons(false);
            
            if (!next.length) {
                next = slideshow.find('figure').first();
            }
            
            next.css('z-index', '7').addClass('current').fadeIn(300, function () {
                next.css('z-index', '');
                current.hide();
                slideshow.find('figure').not(next).hide().removeClass('current');
                next.show().addClass('current');
                methods.slideshow.enableButtons();
            });
        };
        
        methods.slideshow.showPrevPhoto = function () {
            var slideshow, current, prev;
            
            slideshow = methods.slideshow.getSlideshow();
            current = slideshow.find('figure.current').removeClass('current');
            
            prev = current.prev('figure');
            
            methods.slideshow.enableButtons(false);
            
            if (!prev.length) {
                prev = slideshow.find('figure').last();
            }
            
            prev.css('z-index', '7').addClass('current').fadeIn(300, function () {
                prev.css('z-index', '');
                current.hide();
                slideshow.find('figure').not(prev).hide().removeClass('current');
                prev.show().addClass('current');
                methods.slideshow.enableButtons();
            });
        };
        
        methods.slideshow.enableButtons = function (enable) {
            enable = (enable === false) ? false : true;
            
            if (enable) {
                $('.gallery .back').on('click', methods.slideshow.showPrevPhoto);
                $('.gallery .next').on('click', methods.slideshow.showNextPhoto);
            } else {
                $('.gallery .back').off('click', methods.slideshow.showPrevPhoto);
                $('.gallery .next').off('click', methods.slideshow.showNextPhoto);
            }
        };
        
        methods.slideshow.getSlideshow = function () {
            return assets.containerSmall.find('.gallery');
        };
        
        enums.layouts = {
            fullScreen : 'full-screen',
            sidePanel : 'small-screen'
        };
        
        methods.setLayout = function (name) {
            assets.mapContainer.attr('data-map-status', name);
        };
        
        methods.enableFullScreen = function (btn) {
            var element, fullScreenBtn;
            
            assets.fullScreenBtn = btn;

            element = contentView.getAssets().containerFull.get(0);

            if (element.requestFullscreen) {
                fullScreenFunctions.enter = "requestFullscreen";
            } else if (element.mozRequestFullScreen) {
                fullScreenFunctions.enter = "mozRequestFullScreen";
            } else if (element.webkitRequestFullscreen) {
                fullScreenFunctions.enter = "webkitRequestFullscreen";
            } else if (element.msRequestFullscreen) {
                fullScreenFunctions.enter = "msRequestFullscreen";
            }
            
            if (document.exitFullscreen) {
                fullScreenFunctions.exit = "exitFullscreen";
            } else if (document.webkitExitFullscreen) {
                fullScreenFunctions.exit = "webkitExitFullscreen";
            } else if (document.mozCancelFullScreen) {
                fullScreenFunctions.exit = "mozCancelFullScreen";
            } else if (document.msExitFullscreen) {
                fullScreenFunctions.exit = "msExitFullscreen";
            }
            
            if (fullScreenFunctions.enter && fullScreenFunctions.exit) {
                assets.fullScreenBtn.addEventListener('click', methods.toggleFullScreen, false);
            } else {
                btn.parentElement.removeChild(btn);
            }
        };
        
        methods.enterFullScreen = function () {
            contentView.getAssets().containerFull.get(0)[fullScreenFunctions.enter]();
        };
        
        methods.exitFullScreen = function () {
            if (fullScreenFunctions.exit) {
                document[fullScreenFunctions.exit]();
            }
        };
        
        methods.toggleFullScreen = function () {
            if (!methods.isFullScreen()) {
                methods.enterFullScreen();
            } else {
                methods.exitFullScreen();
            }
        };
        
        methods.isFullScreen = function () {
            return (document.fullscreenElement || document.webkitFullscreenElement || document.mozFullScreenElement || document.msFullscreenElement);
        };
        
        return {
            getLayouts : function () { return enums.layouts; },
            setLayout : function (name) { methods.setLayout(name); return this; },
            newContainerFull : function (id) { methods.createNewContainerFull(id); return this; },
            closeContent : function () { methods.closeContent(); return this; },
            updateSideContent : function (name, content) { methods.updateSideContent(name, content); return this; },
            getAssets : function () { return assets; },
            enableFullScreen : function (btn) { methods.enableFullScreen(btn); }
        };
        
    }(jQuery));
	
	searchManager = (function ($) {
		var methods = {}, regexArray = [], regexOptions, searchTargets;
		
        regexOptions = {
            exactMatch : '^@string@$',                  // Exact Match
            firstWordMatch : '^@string@\\s',            // Exact Match
            anyWordMatch : '(^|\\s+)@string@(\\s+|$)',  // Single Word Match
            startPartialMatch : '(^|\\s+)@string@',     // Start Of Word Match
            anyPartialMatch : '@string@'                // Match Any Part Of Word
        };
        
        searchTargets = {
            title : "name",
            keyword : "keyword",
            description : "content"
        };
        
		regexArray = [
			regexOptions.exactMatch,         // Exact Match
			regexOptions.firstWordMatch,     // First Word Match
			regexOptions.anyWordMatch,       // Single Word Match
			regexOptions.startPartialMatch,  // Start Of Word Match
			regexOptions.anyPartialMatch     // Match Any Part Of Word
		];
        
        regexArray = [
            { target: searchTargets.title, regex : regexOptions.exactMatch },
            { target: searchTargets.keyword, regex : regexOptions.exactMatch },
            { target: searchTargets.title, regex : regexOptions.firstWordMatch },
            { target: searchTargets.title, regex : regexOptions.anyWordMatch },
            { target: searchTargets.description, regex : regexOptions.anyWordMatch },
            { target: searchTargets.title, regex : regexOptions.startPartialMatch },
            { target: searchTargets.keyword, regex : regexOptions.startPartialMatch },
            { target: searchTargets.title, regex : regexOptions.anyPartialMatch }
        ];
		
		methods.search = function (string) {
			var regexes = /*regexArray.slice(0)*/ $.extend(true, [], regexArray), results = [], finalResults = [];
			
            results = [];
            finalResults = [];
            
			regexes.forEach(function (regex, i) {
				regexes[i].regex = new RegExp(String(regex.regex).replace('@string@', string), 'i');
			});
				
			$.each(hlguMapData.markers, function (id, data) {
				var i, regex, match;
                
                if (enable360 || (data.content.contentType !== hlguMapData.contentTypes.Video360 && data.content.contentType !== hlguMapData.contentTypes.Photo360)) {
                    for (i = 0; i < regexes.length; i += 1) {
                        regex = regexes[i];

                        match = false;

                        results[i] = results[i] || [];

                        if (methods.checkMatch(data, regex.target, regex.regex)) {
                            results[i].push(data);
                            match = true;
                        }

                        if (match) {
                            break;
                        }
                    }
                }
			});
            
			results.forEach(function (result) {
				finalResults = finalResults.concat(result);
			});
			
			return finalResults;
		};
        
        methods.checkMatch = function (data, target, regex) {
            var string;
            if (target !== searchTargets.keyword) {
                string = data.content[target];
                
                if (target !== searchTargets.title) {
                    string = stripTagsFromString(string);
                    string = filterSelectWordsFromString(string);
                }
                
                return string.match(regex);
            } else {
                return methods.checkForKeywordMatch(data, regex);
            }
        };
        
        methods.checkForKeywordMatch = function (data, regex) {
            var keywords = data.keywords || data.content.keywords || [], i;
            
            for (i = 0; i < keywords.length; i += 1) {
                if (String(keywords[i]).match(regex)) {
                    return true;
                }
            }
            
            return false;
        };
		
		return {
			search : function (string) { return methods.search(string); }
		};
	}(jQuery));

    mapController = (function ($) {
        var methods = {}, status = {}, cachedData;
        $(function () {
            enable360 = (isWebGLCompatible() && !hlguIsIE());
            methods.viewsDidLoad();
            contentView.enableFullScreen($('#btn-full-screen').get(0));
        });
        
        methods.viewsDidLoad = function () {
            var locationBounds;
            
            if (window.innerWidth > 550) {
                navigationView.showMenu(true);
            }
            
            if (!enable360) {
                delete hlguMapData.categories.Views360;
            }
            
            navigationView.populateMenuCategories(hlguMapData.categories, methods.categoriesDidChange, methods.addLocationsToCategories);
            navigationView.getAssets().homeBtn.on('click', mapView.returnToCenter);
            navigationView.getAssets().closeBtn.on('click', function () {
                contentView.closeContent();
                methods.setMarkerState(status.currentMarker, "normal");
                
                if (status.senderMarker) {
                    google.maps.event.trigger(status.senderMarker, "click");
                }
                
                status.senderMarker = null;
                threeSixtyManager.clear360View(contentView.getAssets().containerFull.get(0));
            });
            
            contentView.getAssets().containerSmall.on('click', 'dd', function () {
                var content = hlguMapData.markers[$(this).attr('data-marker-id')].content;
                methods.show360Content(content);
                cachedData = contentView.getAssets().containerSmall.html();
                
                status.senderMarker = status.visibleMarker;
            });
            
            document.addEventListener('webkitfullscreenchange', methods.fullScreenDidChange, false);
            document.addEventListener('mozfullscreenchange', methods.fullScreenDidChange, false);
            document.addEventListener('fullscreenchange', methods.fullScreenDidChange, false);
            document.addEventListener('MSFullscreenChange', methods.fullScreenDidChange, false);
        };
        
        methods.addLocationsToCategories = function () {
            
            $.each(hlguMapData.markers, function (id, data) {
                //if (data.hidden !== true) {
                data.categories.forEach(function (category) {
                    navigationView.addLocationToCategory(data.content.name, id, getKeyForValue(hlguMapData.categories, category));
                });
                //}
            });
            
            navigationView.getAssets().categoryList.on("click", ".markers li", function () {
                var text = $(this).text();
                mapView.showMarkerById($(this).attr("data-marker-id"));
            });
        };
        
        methods.categoriesDidChange = function () {
            var markerStates = [], activeCategories = navigationView.getActiveCategories();
            
            $.each(hlguMapData.markers, function (id, data) {
                if (data.hidden !== true) {
                
                    var markerData = {}, j, category;
                    markerData.id = id;
                    markerData.show = false;
                    markerData.icons = {};

                    for (j = 0; j < data.categories.length; j += 1) {
                        category = getKeyForValue(hlguMapData.categories, data.categories[j]);

                        if (activeCategories.indexOf(category) !== -1) {
                            markerData.show = true;
                            markerData.icons.normal = hlguMapData.icons[category].normal;
                            markerData.icons.active = hlguMapData.icons[category].active;

                            break;
                        }
                    }

                
                    markerStates.push(markerData);
                }
            });
            
            status.currentMarkerStates = markerStates;
            
            mapView.updateMarkers(markerStates);
        };
        
        methods.markerWasClicked = function (sender) {
            var senderMarker = this, senderName, position, senderMarkerState, i;
            sender = senderMarker.get('identifier');
            
            status.visibleMarker = senderMarker;
            
            methods.setMarkerState(status.currentMarker, "normal");
            methods.setMarkerState(sender, "active");
            
            status.currentMarker = sender;
            
            position = senderMarker.getPosition();
            
            sender = hlguMapData.markers[sender];
            
            if (sender.content.contentType === hlguMapData.contentTypes.Video360 || sender.content.contentType === hlguMapData.contentTypes.Photo360) {
                methods.show360Content(sender.content);
            } else {
                methods.launchSideContent(sender, position);
            }
        };
        
        methods.show360Content = function (content) {
            switch (content.contentType) {
            case hlguMapData.contentTypes.Video360:
                methods.launch360video(content.content, (content.args || false));
                break;
            case hlguMapData.contentTypes.Photo360:
                methods.launch360photo(content.content, (content.args || false));
                break;
            default:
                break;
            }
        };
        
        methods.setMarkerState = function (name, state) {
            var i;
            
            state = state.toLowerCase();
            state = (state === "active") ? "active" : "normal";
            
            for (i = 0; i < status.currentMarkerStates.length; i += 1) {
                if (status.currentMarkerStates[i].id === name) {
					if (!hlguIsIE()) {
                    	mapView.setMarkerIcon(name, status.currentMarkerStates[i].icons[state]);
					}
                    
                    
                    break;
                }
            }
        };
        
        status.videoCount = 0;
        
        methods.launchSideContent = function (sender, position) {
            var offset = 0;
            contentView.setLayout(contentView.getLayouts().sidePanel);
            contentView.updateSideContent(sender.id, sender.content);
            
            offset = contentView.getAssets().containerSmall.outerWidth() / 2;
            
            mapView.panTo(position, offset);
        };
        
        methods.launch360video = function (url, args) {
            url = '/video/360/' + url;
            args = args || {};
            
            args.type = "video";
            
            methods.launch360content(url, args);
        };
        
        methods.launch360photo = function (url, args) {
            url = '/video/360/' + url;
            args = args || {};
            
            args.type = "photo";
            
            methods.launch360content(url, args);
        };
        
        methods.launch360content = function (url, args) {
            var container = contentView.getAssets().containerFull.get(0), link;
            
            link = document.createElement("a");
            link.href = url;
            
            url = link.protocol + "//" + link.host + link.pathname + link.search + link.hash;
            
            contentView.setLayout(contentView.getLayouts().fullScreen);
            threeSixtyManager.embed360View(container, url, args);
        };
        
        methods.initializeMap = function () {
            mapView.initializeMap('gmap', hlguMapData.parameters.zoom, hlguMapData.parameters.lat, hlguMapData.parameters.lng, hlguMapData.settings).setMarkers(hlguMapData.markers, [{event: "click", target: methods.markerWasClicked}]);
        
            google.maps.Map.prototype.panToWithOffset = function (latlng, offsetX, offsetY) {
                var map = this, ov = new google.maps.OverlayView();
                ov.onAdd = function () {
                    var proj = this.getProjection(), aPoint;

                    aPoint = proj.fromLatLngToContainerPixel(latlng);
                    aPoint.x = aPoint.x + offsetX;
                    aPoint.y = aPoint.y + offsetY;
                    map.panTo(proj.fromContainerPixelToLatLng(aPoint));
                };
                ov.draw = function () {};
                ov.setMap(this);
            };
            
            methods.categoriesDidChange();
            
            if (/Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent)) {
                mapView.enableLocationTracker($('#location-button'), (new google.maps.LatLngBounds(
                    new google.maps.LatLng(39.727255, -91.395940),
                    new google.maps.LatLng(39.735625, -91.386650)
                )));
            }
        };
        
        methods.fullScreenDidChange = function () {
            if (methods.isFullScreen()) {
                contentView.getAssets().fullScreenBtn.setAttribute('data-fullscreen-360', true);
            } else {
                contentView.getAssets().fullScreenBtn.setAttribute('data-fullscreen-360', false);
            }
        };
        
        methods.isFullScreen = function () {
            return (document.fullscreenElement || document.webkitFullscreenElement || document.mozFullScreenElement || document.msFullscreenElement);
        };
        
        return {
            initializeMap : function () { methods.initializeMap(); return this; }
        };
        
    }(jQuery));
    
    youtubeController = (function () {
        var methods = {}, status = {}, queue;
        
        status.ready = false;
        
        methods.isReady = function () {
            status.ready = true;
        };
        
        status.videoCount = 0;
        
        methods.embed360video = function (youtubeId, id) {
            var player;
            
            player = new YT.Player(id, {
                height: '390',
                width: '640',
                videoId: youtubeId,
                playerVars : {
                    'autoplay' : 1,
                    'rel' : 0,
                    'showinfo' : 0,
                    'showsearch' : 0,
                    'controls' : 0,
                    'loop' : 1,
                    'enablejsapi' : 1,
                    'playlist': youtubeId
                },
                events: {
                //'onReady': onPlayerReady,
                //'onStateChange': onPlayerStateChange
                }
            });
        };
        
        methods.embedSideContentVideo = function (youtubeId, id) {
            var player;
            
            player = new YT.Player(id, {
                height: '390',
                width: '640',
                videoId: youtubeId,
                playerVars : {
                    'autoplay' : 0,
                    'rel' : 0,
                    'showinfo' : 1,
                    'showsearch' : 0,
                    'controls' : 1,
                    'loop' : 1,
                    'enablejsapi' : 1
                }
            });
        };
        
        return {
            isReady : function () { methods.isReady(); },
            embed360video : function (youtubeId, id) { return methods.embed360video(youtubeId, id); },
            embedSideContentVideo : function (youtubeId, id) { methods.embedSideContentVideo(youtubeId, id); return this; }
        };
        
    }());
    
    getKeyForValue = function (object, targetValue) {
        var result = false;
        
        $.each(object, function (key, value) {
            if (value === targetValue) { result = key; return false; }
        });

        return result;
    };
    
    getMarkerContentById = function (id) {
        var content = false;
        hlguMapData.markers.forEach(function (marker) {
            if (marker.id && marker.id === id) {
                content = marker.content;
                return false;
            }
        });
        
        return content;
    };
    
    (function ($) {
        var methods = {}, assets = {}, timer, loopTimer, status = {};

        $(function () {
            assets.searchContainer = $("#search-results");
            assets.openSearchButton = $("#open-search");
            assets.closeSearchButton = $("#close-search");
            assets.searchField = $("#search-field");
            assets.searchResults = assets.searchContainer.find('.results');
            assets.loading = assets.searchContainer.find(".loading").first();

            assets.openSearchButton.on('click', methods.showSearch);
            assets.closeSearchButton.on('click', function () {
                var value = assets.searchField.val();

                if (value !== "") {
                    assets.searchField.val("");
                    methods.showResults(false);
                } else {
                    methods.showSearch(false);
                }
            });

            assets.searchField.on('touchstart', function () {
                $(this).focus();
            });
        });

        methods.showSearch = function (show) {
            show = (show !== false);

            if (show) {
                assets.searchField.html("").val("").trigger('blur');
                assets.searchContainer.removeClass("hidden");
                setTimeout(function () {
                    assets.searchField.prop("disabled", false);
                    assets.searchField.click().focus().trigger('touchstart');
                    methods.startCheckingValChange();
                }, 350);
            } else {
                assets.searchContainer.addClass("hidden");
                assets.searchField.prop("disabled", true);
                status.searchTerm = false;

                methods.stopCheckingValChange();

                methods.showLoadBar(false);
                methods.showResults(false);

                setTimeout(function () {
                    assets.searchField.val("");
                }, 350);
            }
        };

        methods.startCheckingValChange = function () {
            if (!status.checkVal) {
                status.checkVal = true;
                methods.checkForValChange();
            }
        };

        methods.stopCheckingValChange = function () {
            status.checkVal = false;
        };

        methods.checkForValChange = function () {
            var value = assets.searchField.val();

            status.lastValue = status.lastValue || "";

            if (status.lastValue !== value) {

                if (timer) {
                    clearTimeout(timer);
                }

                if (status.lastValue !== "") {
                    timer = setTimeout(function () {
                        methods.performSearch(value);
                    }, 500);
                }
            }

            status.lastValue = value;

            if (status.checkVal) {

                if ((status.searchTerm && value !== "" &&  status.searchTerm !== value) || (!status.searchTerm && value !== "")) {
                    methods.showLoadBar(true);

                } else {
                    methods.showLoadBar(false);
                }

                loopTimer = setTimeout(methods.checkForValChange, 100);
            }
        };

        methods.showLoadBar = function (show) {
            show = (show !== false);

            if (show) {
                assets.loading.slideDown(100);
            } else {
                assets.loading.slideUp(100);
            }
        };

        methods.searchEmptied = function () {

            status.searchTerm = false;

            if (timer) {
                clearTimeout(timer);
            }
        };

        methods.performSearch = function (value) {

            if (value !== status.searchTerm && value !== "") {
                methods.populateResults(value, searchManager.search(value));
                methods.showResults();
            } else if (value === "") {
                methods.showResults(false);
            }
            status.searchTerm = value;
        };

        methods.populateResults = function (term, results) {
            var list, title;

            assets.searchResults.html('');

            if (results.length) {
                list = $('<dl></dl');
                title = $('<dt></dt>').html(term + ' <span class="count">' + results.length + '</span>');

                list.append(title);

                $.each(results, function (index, result) {
                    list.append($('<dd>' + result.content.name + '</dd>').attr('data-marker-id', result.id).on('click', function () {mapView.showMarkerById(result.id); }));
                });

                assets.searchResults.append(list);
            } else {
                assets.searchResults.append($('<p>No Results Found</p>'));
            }
        };

        methods.showResults = function (show) {
            show = (show !== false);

            if (show) {
                assets.searchContainer.addClass('show-results');
            } else {
                assets.searchContainer.removeClass('show-results');
            }
        };


    }(jQuery));
    
    return {
        initialize : function () { mapController.initializeMap(); return this; },
        youtubeIsReady : function () { youtubeController.isReady(); }
    };
    
}(jQuery));

function onYouTubeIframeAPIReady() {
    'use strict';
    
    hlguMap.youtubeIsReady();
}

function hlguIsIE() {
	return (navigator.appName == 'Microsoft Internet Explorer' || !!(navigator.userAgent.match(/Trident/)))
}