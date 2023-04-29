export interface AppUser {
    name: string
    lastname: string
    birthday: string
    username: string
    email: string
    password: string
    galleries: Gallery[]
}

export interface Gallery {
    name: string
    documents: Document[]
}

export interface Document {
    name: string
    type: string
    size: number
    creationDate: string
    lastChangeDate: string
    description: string
    tag: string
}

// 


/**
 * {
 "username": {
  "S": "nana"
 },
 "galeryName": {
  "S": "root"
 },
 "document": {
  "L": [
   {
    "M": {
     "documetName": {
      "S": "hdkuigaeuhaks"
     },
     "type": {
      "S": "jpg"
     },
     "size": {
      "N": "0"
     },
     "creationDate": {
      "S": "11.11.2022."
     },
     "lastChangeDate": {
      "S": "11.11.2022."
     },
     "description": {
      "S": "sssssssss"
     },
     "tag": {
      "S": "cat"
     }
    }
   },
   {
    "M": {
     "documetName": {
      "S": "scaksnj"
     },
     "type": {
      "S": "pdf"
     },
     "size": {
      "N": "0"
     },
     "creationDate": {
      "S": "11.11.2022."
     },
     "lastChangeDate": {
      "S": "11.11.2022."
     },
     "description": {
      "S": "sssssssss"
     },
     "tag": {
      "S": "dog"
     }
    }
   }
  ]
 },
 "name": {
  "S": "Nikola"
 },
 "lastname": {
  "S": "Nikolic"
 },
 "birthday": {
  "S": "11.11.2001."
 },
 "email": {
  "S": "nana@gmail.com"
 },
 "password": {
  "S": "222"
 }
}
 */