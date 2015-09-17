Pruebas cartilla

***** Desde Postman *****

******** Buscar afiliado *************
http://www.osdepym.com.ar:8080/OSDEPYM_CartillaWeb2/rest/mobile/getAfiliado?dni=22755022&sexo=M

{
    "afiliadoTO": {
        "cuil": 20227550229,
        "dni": 22755022,
        "nombre": "JUAN CARLOS, GARCIA",
        "plan": "PERSONAL  ",
        "sexo": "M"
    }
}

********** CARTILLA *********
http://www.osdepym.com.ar:8080/OSDEPYM_CartillaWeb2/rest/mobile/cartilla?dni=22755022&sexo=M

[
    {
        "prestadorTO": {
            "calle": "A MARIA SAENZ",
            "codigoPostal": 1832,
            "departamento": "",
            "especialidad": "LABORATORIO DE ANÁLISIS CLÍNIC",
            "idBaseDeDatos": 0,
            "latitud": -34.757958,
            "localidad": "LOMAS DE ZAMORA",
            "longitud": -58.401291,
            "nombre": ".CEPRESALUD",
            "numeroCalle": 355,
            "piso": "",
            "telefonos": "(  54)( 011)  42445891",
            "zona": "GBA SUR"
        }
    },
    {
        "prestadorTO": {
            "calle": "AGUERO",
            "codigoPostal": 1425,
            "departamento": "Dpto. 2",
            "especialidad": "LABORATORIO DE ANÁLISIS CLÍNIC",
            "idBaseDeDatos": 1,
            "latitud": "-34.595140",
            "localidad": "RECOLETA",
            "longitud": -58.409447,
            "nombre": ".CEPRESALUD",
            "numeroCalle": 1238,
            "piso": "Piso PB",
            "telefonos": "(  54)( 011)  49620541",
            "zona": "CAPITAL FEDERAL"
        }
    },
    {
        "prestadorTO": {
            "calle": "ALMAFUERTE",
            "codigoPostal": 1754,
            "departamento": "",
            "especialidad": "LABORATORIO DE ANÁLISIS CLÍNIC",
            "idBaseDeDatos": 2,
            "latitud": -34.681472,
            "localidad": "SAN JUSTO",
            "longitud": -58.555087,
            "nombre": ".CEPRESALUD",
            "numeroCalle": 3545,
            "piso": "",
            "telefonos": "(  54)( 011)  44821472",
            "zona": "GBA OESTE"
        }
    },
    {
        "prestadorTO": {
            "calle": "AV B RIVADAVIA",
            "codigoPostal": 1424,
            "departamento": "Dpto. B",
            "especialidad": "LABORATORIO DE ANÁLISIS CLÍNIC",
            "idBaseDeDatos": 3,
            "latitud": -34.619247,
            "localidad": "CABALLITO",
            "longitud": -58.438518,
            "nombre": ".CEPRESALUD",
            "numeroCalle": 5170,
            "piso": "Piso 5",
            "telefonos": "(  54)( 011)  49016543",
            "zona": "CAPITAL FEDERAL"
        }
    },
    {
        "prestadorTO": {
            "calle": "AV B RIVADAVIA",
            "codigoPostal": 1408,
            "departamento": "",
            "especialidad": "LABORATORIO DE ANÁLISIS CLÍNIC",
            "idBaseDeDatos": 4,
            "latitud": -34.638914,
            "localidad": "LINIERS",
            "longitud": -58.519274,
            "nombre": ".CEPRESALUD",
            "numeroCalle": 11057,
            "piso": "",
            "telefonos": [
                "(  54)( 011)  46431093",
                "(  54)( 011)  46444903"
            ],
            "zona": "CAPITAL FEDERAL"
        }
    }
]



******** Busqueda por filtro ***********

http://www.osdepym.com.ar:8080/OSDEPYM_CartillaWeb2/rest/mobile/busquedaPrestadores?dni=22755022&sexo=M&nombrePrestador=.CEPRESALUD

[
    {
        "prestadorTO": {
            "calle": "A MARIA SAENZ",
            "codigoPostal": 1832,
            "departamento": "",
            "especialidad": "LABORATORIO DE ANÁLISIS CLÍNIC",
            "idBaseDeDatos": 0,
            "latitud": -34.757958,
            "localidad": "LOMAS DE ZAMORA",
            "longitud": -58.401291,
            "nombre": ".CEPRESALUD",
            "numeroCalle": 355,
            "piso": "",
            "telefonos": "(  54)( 011)  42445891",
            "zona": "GBA SUR"
        }
    },
    {
        "prestadorTO": {
            "calle": "AGUERO",
            "codigoPostal": 1425,
            "departamento": "Dpto. 2",
            "especialidad": "LABORATORIO DE ANÁLISIS CLÍNIC",
            "idBaseDeDatos": 1,
            "latitud": "-34.595140",
            "localidad": "RECOLETA",
            "longitud": -58.409447,
            "nombre": ".CEPRESALUD",
            "numeroCalle": 1238,
            "piso": "Piso PB",
            "telefonos": "(  54)( 011)  49620541",
            "zona": "CAPITAL FEDERAL"
        }
    },
    {
        "prestadorTO": {
            "calle": "ALMAFUERTE",
            "codigoPostal": 1754,
            "departamento": "",
            "especialidad": "LABORATORIO DE ANÁLISIS CLÍNIC",
            "idBaseDeDatos": 2,
            "latitud": -34.681472,
            "localidad": "SAN JUSTO",
            "longitud": -58.555087,
            "nombre": ".CEPRESALUD",
            "numeroCalle": 3545,
            "piso": "",
            "telefonos": "(  54)( 011)  44821472",
            "zona": "GBA OESTE"
        }
    },
    {
        "prestadorTO": {
            "calle": "AV B RIVADAVIA",
            "codigoPostal": 1424,
            "departamento": "Dpto. B",
            "especialidad": "LABORATORIO DE ANÁLISIS CLÍNIC",
            "idBaseDeDatos": 3,
            "latitud": -34.619247,
            "localidad": "CABALLITO",
            "longitud": -58.438518,
            "nombre": ".CEPRESALUD",
            "numeroCalle": 5170,
            "piso": "Piso 5",
            "telefonos": "(  54)( 011)  49016543",
            "zona": "CAPITAL FEDERAL"
        }
    },
    {
        "prestadorTO": {
            "calle": "AV B RIVADAVIA",
            "codigoPostal": 1408,
            "departamento": "",
            "especialidad": "LABORATORIO DE ANÁLISIS CLÍNIC",
            "idBaseDeDatos": 4,
            "latitud": -34.638914,
            "localidad": "LINIERS",
            "longitud": -58.519274,
            "nombre": ".CEPRESALUD",
            "numeroCalle": 11057,
            "piso": "",
            "telefonos": [
                "(  54)( 011)  46431093",
                "(  54)( 011)  46444903"
            ],
            "zona": "CAPITAL FEDERAL"
        }
    },
    {
        "prestadorTO": {
            "calle": "AV CORDOBA",
            "codigoPostal": 1120,
            "departamento": "Dpto. E",
            "especialidad": "LABORATORIO DE ANÁLISIS CLÍNIC",
            "idBaseDeDatos": 6,
            "latitud": -34.599572,
            "localidad": "RECOLETA",
            "longitud": -58.396703,
            "nombre": ".CEPRESALUD",
            "numeroCalle": 2077,
            "piso": "Piso 1",
            "telefonos": "(  54)( 011)  49617848",
            "zona": "CAPITAL FEDERAL"
        }
    },
    {
        "prestadorTO": {
            "calle": "AV CORRIENTES",
            "codigoPostal": 1414,
            "departamento": "Dpto. A",
            "especialidad": "LABORATORIO DE ANÁLISIS CLÍNIC",
            "idBaseDeDatos": 7,
            "latitud": "-34.596800",
            "localidad": "VILLA CRESPO",
            "longitud": -58.441941,
            "nombre": ".CEPRESALUD",
            "numeroCalle": 5535,
            "piso": "Piso PB",
            "telefonos": "(  54)( 011)  48546423",
            "zona": "CAPITAL FEDERAL"
        }
    },
    {
        "prestadorTO": {
            "calle": "AV RIVADAVIA",
            "codigoPostal": 1708,
            "departamento": "",
            "especialidad": "LABORATORIO DE ANÁLISIS CLÍNIC",
            "idBaseDeDatos": 8,
            "latitud": -34.649247,
            "localidad": "MORON",
            "longitud": -58.623722,
            "nombre": ".CEPRESALUD",
            "numeroCalle": 18480,
            "piso": "",
            "telefonos": "          ",
            "zona": "GBA OESTE"
        }
    },
    {
        "prestadorTO": {
            "calle": "AV TRIUNVIRATO",
            "codigoPostal": 1431,
            "departamento": "",
            "especialidad": "LABORATORIO DE ANÁLISIS CLÍNIC",
            "idBaseDeDatos": 9,
            "latitud": -34.576787,
            "localidad": "VILLA URQUIZA",
            "longitud": -58.482317,
            "nombre": ".CEPRESALUD",
            "numeroCalle": 4381,
            "piso": "",
            "telefonos": "(  54)( 011)  45234948",
            "zona": "CAPITAL FEDERAL"
        }
    },
    {
        "prestadorTO": {
            "calle": "CNEL R L FALCON",
            "codigoPostal": 1406,
            "departamento": "",
            "especialidad": "LABORATORIO DE ANÁLISIS CLÍNIC",
            "idBaseDeDatos": 10,
            "latitud": -34.630709,
            "localidad": "FLORES",
            "longitud": -58.464077,
            "nombre": ".CEPRESALUD",
            "numeroCalle": 2534,
            "piso": "",
            "telefonos": "(  54)( 011)  46109900",
            "zona": "CAPITAL FEDERAL"
        }
    },
    {
        "prestadorTO": {
            "calle": "FRANCIA",
            "codigoPostal": 1617,
            "departamento": "",
            "especialidad": "LABORATORIO DE ANÁLISIS CLÍNIC",
            "idBaseDeDatos": 11,
            "latitud": -34.472524,
            "localidad": "EL TALAR",
            "longitud": -58.655408,
            "nombre": ".CEPRESALUD",
            "numeroCalle": 1039,
            "piso": "",
            "telefonos": "(  54)( 011)  48530113",
            "zona": "GBA NORTE"
        }
    },
    {
        "prestadorTO": {
            "calle": "OLLEROS",
            "codigoPostal": 1426,
            "departamento": "",
            "especialidad": "LABORATORIO DE ANÁLISIS CLÍNIC",
            "idBaseDeDatos": 12,
            "latitud": -34.570689,
            "localidad": "COLEGIALES",
            "longitud": -58.443874,
            "nombre": ".CEPRESALUD",
            "numeroCalle": 2410,
            "piso": "Piso 3",
            "telefonos": "(  54)( 011)  47763818",
            "zona": "CAPITAL FEDERAL"
        }
    },
    {
        "prestadorTO": {
            "calle": "RIOBAMBA",
            "codigoPostal": 1824,
            "departamento": "",
            "especialidad": "LABORATORIO DE ANÁLISIS CLÍNIC",
            "idBaseDeDatos": 13,
            "latitud": -34.702573,
            "localidad": "LANUS",
            "longitud": -58.391525,
            "nombre": ".CEPRESALUD",
            "numeroCalle": 15,
            "piso": "",
            "telefonos": "(  54)( 011)  42476217",
            "zona": "GBA SUR"
        }
    },
    {
        "prestadorTO": {
            "calle": "AV PTE H YRIGOYEN",
            "codigoPostal": 1832,
            "departamento": "",
            "especialidad": "VACUNATORIO",
            "idBaseDeDatos": 14,
            "latitud": -34.763066,
            "localidad": "LOMAS DE ZAMORA",
            "longitud": -58.403225,
            "nombre": ".CEPRESALUD - LOMAS DE ZAMORA",
            "numeroCalle": 9221,
            "piso": "",
            "telefonos": "(  54)08101229876",
            "zona": "GBA SUR"
        }
    },
    {
        "prestadorTO": {
            "calle": "AV PTE H YRIGOYEN",
            "codigoPostal": 1832,
            "departamento": "",
            "especialidad": "OFTALMOLOGÍA",
            "horarios": "Viernes de 16:00hs. a 20:00hs.",
            "idBaseDeDatos": 15,
            "latitud": -34.763066,
            "localidad": "LOMAS DE ZAMORA",
            "longitud": -58.403225,
            "nombre": ".CEPRESALUD - LOMAS DE ZAMORA, ACQUISTO DAMIAN",
            "numeroCalle": 9221,
            "piso": "",
            "telefonos": "(  54)08101229876",
            "zona": "GBA SUR"
        }
    },
    {
        "prestadorTO": {
            "calle": "AV PTE H YRIGOYEN",
            "codigoPostal": 1832,
            "departamento": "",
            "especialidad": "DERMATOLOGÍA",
            "horarios": "Lunes de 16:00hs. a 20:00hs.",
            "idBaseDeDatos": 16,
            "latitud": -34.763066,
            "localidad": "LOMAS DE ZAMORA",
            "longitud": -58.403225,
            "nombre": ".CEPRESALUD - LOMAS DE ZAMORA, ALEKSANDROWICZ MARIA DANIELA",
            "numeroCalle": 9221,
            "piso": "",
            "telefonos": "(  54)( 011)08101229876",
            "zona": "GBA SUR"
        }
    },
    {
        "prestadorTO": {
            "calle": "AV PTE H YRIGOYEN",
            "codigoPostal": 1832,
            "departamento": "",
            "especialidad": "GINECOLOGÍA",
            "horarios": [
                "Jueves de 12:00hs. a 20:00hs.",
                "Martes de 12:00hs. a 20:00hs."
            ],
            "idBaseDeDatos": 17,
            "latitud": -34.763066,
            "localidad": "LOMAS DE ZAMORA",
            "longitud": -58.403225,
            "nombre": ".CEPRESALUD - LOMAS DE ZAMORA, ANALIS SABRINA",
            "numeroCalle": 9221,
            "piso": "",
            "telefonos": "(  54)( 011)08101229876",
            "zona": "GBA SUR"
        }
    },
    {
        "prestadorTO": {
            "calle": "AV PTE H YRIGOYEN",
            "codigoPostal": 1832,
            "departamento": "",
            "especialidad": "GASTROENTEROLOGÍA",
            "horarios": [
                "Jueves de 16:00hs. a 20:00hs.",
                "Lunes de 16:00hs. a 20:00hs.",
                "Miércoles de 16:00hs. a 20:00hs."
            ],
            "idBaseDeDatos": 19,
            "latitud": -34.763066,
            "localidad": "LOMAS DE ZAMORA",
            "longitud": -58.403225,
            "nombre": ".CEPRESALUD - LOMAS DE ZAMORA, BARDELLI PATRICIA",
            "numeroCalle": 9221,
            "piso": "",
            "telefonos": "(  54)( 011)08101229876",
            "zona": "GBA SUR"
        }
    },
    {
        "prestadorTO": {
            "calle": "AV PTE H YRIGOYEN",
            "codigoPostal": 1832,
            "departamento": "",
            "especialidad": "GINECOLOGÍA",
            "horarios": [
                "Miércoles de 08:00hs. a 20:00hs.",
                "Sábado de 08:00hs. a 13:00hs."
            ],
            "idBaseDeDatos": 22,
            "latitud": -34.763066,
            "localidad": "LOMAS DE ZAMORA",
            "longitud": -58.403225,
            "nombre": ".CEPRESALUD - LOMAS DE ZAMORA, BARTHAU PABLO",
            "numeroCalle": 9221,
            "piso": "",
            "telefonos": "(  54)( 011)081012209876",
            "zona": "GBA SUR"
        }
    },
    {
        "prestadorTO": {
            "calle": "AV PTE H YRIGOYEN",
            "codigoPostal": 1832,
            "departamento": "",
            "especialidad": "ECOGRAFÍA",
            "horarios": [
                "Jueves de 16:00hs. a 20:00hs.",
                "Miércoles de 13:00hs. a 18:00hs."
            ],
            "idBaseDeDatos": 24,
            "latitud": -34.763066,
            "localidad": "LOMAS DE ZAMORA",
            "longitud": -58.403225,
            "nombre": ".CEPRESALUD - LOMAS DE ZAMORA, ECOGRAFIAS",
            "numeroCalle": 9221,
            "piso": "",
            "telefonos": "(  54)08101229876",
            "zona": "GBA SUR"
        }
    },
    {
        "prestadorTO": {
            "calle": "AV PTE H YRIGOYEN",
            "codigoPostal": 1832,
            "departamento": "",
            "especialidad": "PEDIATRÍA",
            "horarios": [
                "Lunes de 08:00hs. a 12:00hs.",
                "Martes de 08:00hs. a 16:00hs.",
                "Viernes de 08:00hs. a 16:00hs."
            ],
            "idBaseDeDatos": 26,
            "latitud": -34.763066,
            "localidad": "LOMAS DE ZAMORA",
            "longitud": -58.403225,
            "nombre": ".CEPRESALUD - LOMAS DE ZAMORA, JAHANA NATALIA",
            "numeroCalle": 9221,
            "piso": "",
            "telefonos": "(  54)( 011)08101229876",
            "zona": "GBA SUR"
        }
    },
    {
        "prestadorTO": {
            "calle": "AV PTE H YRIGOYEN",
            "codigoPostal": 1832,
            "departamento": "",
            "especialidad": "ODONTOLOGÍA GENERAL",
            "horarios": [
                "Jueves de 15:00hs. a 20:00hs.",
                "Lunes de 08:00hs. a 12:00hs.",
                "Martes de 08:00hs. a 12:00hs.",
                "Martes de 15:00hs. a 20:00hs."
            ],
            "idBaseDeDatos": 29,
            "latitud": -34.763066,
            "localidad": "LOMAS DE ZAMORA",
            "longitud": -58.403225,
            "nombre": ".CEPRESALUD - LOMAS DE ZAMORA, LOMUTO GABRIELA CRISTINA",
            "numeroCalle": 9221,
            "piso": "",
            "telefonos": [
                "(  54)( 011)  54365640",
                "(  54)( 011)08101229876"
            ],
            "zona": "GBA SUR"
        }
    },
    {
        "prestadorTO": {
            "calle": "AV PTE H YRIGOYEN",
            "codigoPostal": 1832,
            "departamento": "",
            "especialidad": "CLÍNICA MÉDICA",
            "horarios": [
                "Jueves de 12:00hs. a 16:00hs.",
                "Martes de 12:00hs. a 16:00hs.",
                "Miércoles de 12:00hs. a 20:00hs."
            ],
            "idBaseDeDatos": 37,
            "latitud": -34.763066,
            "localidad": "LOMAS DE ZAMORA",
            "longitud": -58.403225,
            "nombre": ".CEPRESALUD - LOMAS DE ZAMORA, MAGGI SANTIAGO",
            "numeroCalle": 9221,
            "piso": "",
            "telefonos": "(  54)( 011)08101229876",
            "zona": "GBA SUR"
        }
    },
    {
        "prestadorTO": {
            "calle": "AV PTE H YRIGOYEN",
            "codigoPostal": 1832,
            "departamento": "",
            "especialidad": "CLÍNICA MÉDICA",
            "horarios": [
                "Jueves de 08:00hs. a 20:00hs.",
                "Lunes de 08:00hs. a 20:00hs."
            ],
            "idBaseDeDatos": 40,
            "latitud": -34.763066,
            "localidad": "LOMAS DE ZAMORA",
            "longitud": -58.403225,
            "nombre": ".CEPRESALUD - LOMAS DE ZAMORA, MELUSSI RAUL",
            "numeroCalle": 9221,
            "piso": "",
            "telefonos": "(  54)( 011)08101229876",
            "zona": "GBA SUR"
        }
    },
    {
        "prestadorTO": {
            "calle": "AV PTE H YRIGOYEN",
            "codigoPostal": 1832,
            "departamento": "",
            "especialidad": "CLÍNICA MÉDICA",
            "horarios": [
                "Martes de 12:00hs. a 20:00hs.",
                "Miércoles de 08:00hs. a 16:00hs.",
                "Viernes de 08:00hs. a 16:00hs."
            ],
            "idBaseDeDatos": 42,
            "latitud": -34.763066,
            "localidad": "LOMAS DE ZAMORA",
            "longitud": -58.403225,
            "nombre": ".CEPRESALUD - LOMAS DE ZAMORA, ORLANDO ROMINA",
            "numeroCalle": 9221,
            "piso": "",
            "telefonos": "(  54)( 011)08101229876",
            "zona": "GBA SUR"
        }
    },
    {
        "prestadorTO": {
            "calle": "AV PTE H YRIGOYEN",
            "codigoPostal": 1832,
            "departamento": "",
            "especialidad": "ODONTOLOGÍA - ENDODONCIA",
            "horarios": [
                "Miércoles de 16:00hs. a 20:00hs.",
                "Viernes de 16:00hs. a 20:00hs."
            ],
            "idBaseDeDatos": 45,
            "latitud": -34.763066,
            "localidad": "LOMAS DE ZAMORA",
            "longitud": -58.403225,
            "nombre": ".CEPRESALUD - LOMAS DE ZAMORA, PETRIC GABRIELA",
            "numeroCalle": 9221,
            "piso": "",
            "telefonos": "(  54)08101229876",
            "zona": "GBA SUR"
        }
    },
    {
        "prestadorTO": {
            "calle": "AV PTE H YRIGOYEN",
            "codigoPostal": 1832,
            "departamento": "",
            "especialidad": "UROLOGÍA",
            "horarios": [
                "Jueves de 09:00hs. a 12:00hs.",
                "Martes de 09:00hs. a 12:00hs.",
                "Miércoles de 12:00hs. a 16:00hs.",
                "Viernes de 12:00hs. a 16:00hs."
            ],
            "idBaseDeDatos": 47,
            "latitud": -34.763066,
            "localidad": "LOMAS DE ZAMORA",
            "longitud": -58.403225,
            "nombre": ".CEPRESALUD - LOMAS DE ZAMORA, RODRIGUEZ NORBERTO OMAR",
            "numeroCalle": 9221,
            "piso": "",
            "telefonos": "(  54)( 011)08101229876",
            "zona": "GBA SUR"
        }
    },
    {
        "prestadorTO": {
            "calle": "AV PTE H YRIGOYEN",
            "codigoPostal": 1832,
            "departamento": "",
            "especialidad": "CARDIOLOGÍA",
            "horarios": [
                "Jueves de 08:00hs. a 16:00hs.",
                "Lunes de 08:00hs. a 12:00hs.",
                "Martes de 08:00hs. a 12:00hs.",
                "Miércoles de 08:00hs. a 12:00hs.",
                "Viernes de 08:00hs. a 12:00hs."
            ],
            "idBaseDeDatos": 51,
            "latitud": -34.763066,
            "localidad": "LOMAS DE ZAMORA",
            "longitud": -58.403225,
            "nombre": ".CEPRESALUD - LOMAS DE ZAMORA, SOLER FERNANDO",
            "numeroCalle": 9221,
            "piso": "",
            "telefonos": "(  54)( 011)08101229876",
            "zona": "GBA SUR"
        }
    },
    {
        "prestadorTO": {
            "calle": "AV PTE H YRIGOYEN",
            "codigoPostal": 1832,
            "departamento": "",
            "especialidad": "CLÍNICA MÉDICA",
            "horarios": [
                "Jueves de 08:00hs. a 12:00hs.",
                "Lunes de 08:00hs. a 12:00hs.",
                "Martes de 08:00hs. a 12:00hs.",
                "Miércoles de 16:00hs. a 20:00hs.",
                "Viernes de 08:00hs. a 12:00hs.",
                "Viernes de 16:00hs. a 20:00hs."
            ],
            "idBaseDeDatos": 56,
            "latitud": -34.763066,
            "localidad": "LOMAS DE ZAMORA",
            "longitud": -58.403225,
            "nombre": ".CEPRESALUD - LOMAS DE ZAMORA, TORRES SONIA",
            "numeroCalle": 9221,
            "piso": "",
            "telefonos": "(  54)( 011)08101229876",
            "zona": "GBA SUR"
        }
    },
    {
        "prestadorTO": {
            "calle": "25 DE MAYO",
            "codigoPostal": 5500,
            "departamento": "",
            "especialidad": "LABORATORIO DE ANÁLISIS CLÍNIC",
            "idBaseDeDatos": 62,
            "latitud": -32.895437,
            "localidad": "MENDOZA",
            "longitud": -68.848775,
            "nombre": ".CEPRESALUD, LAB.PEREZ ELIZALDE",
            "numeroCalle": 576,
            "piso": "",
            "telefonos": "(  54)(0261)   4233063",
            "zona": "MENDOZA"
        }
    }
]