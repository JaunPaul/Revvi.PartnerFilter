/* eslint-disable */
// Generated from Webflow CMS schema. Do not edit by hand.

export interface WebflowImageValue {
  fileId: string
  url: string
  alt: string | null
}

export interface WebflowCollectionFieldSchema {
  id: string
  isEditable: boolean
  isRequired: boolean
  type: string
  slug: string
  displayName: string
  helpText: string | null
  validations: Record<string, unknown> | null
}

export interface WebflowCollectionSchema {
  id: string
  displayName: string
  singularName: string
  slug: string
  createdOn: string
  lastUpdated: string
  fields: WebflowCollectionFieldSchema[]
}

export interface WebflowSiteSchema {
  id: string
  displayName: string
  shortName: string
  workspaceId: string
  previewUrl: string | null
  timeZone: string
  createdOn: string
  lastUpdated: string
  lastPublished: string | null
  fullSiteCompiledAt: string | null
}

export interface WebflowSchemaBundle {
  site: WebflowSiteSchema
  collections: WebflowCollectionSchema[]
}

export interface TheRevviCommunityItem {
  id: string
  cmsLocaleId: string
  lastPublished: string | null
  lastUpdated: string | null
  createdOn: string
  isArchived: boolean
  isDraft: boolean
  fieldData: {
    featured: boolean | null
    date: string | null
    "community-tag-2": string | null
    image: WebflowImageValue | null
    summary: string | null
    body: string | null
    "minutes-to-read": string | null
    name: string | null
    slug: string | null
  }
}

export interface PartnerItem {
  id: string
  cmsLocaleId: string
  lastPublished: string | null
  lastUpdated: string | null
  createdOn: string
  isArchived: boolean
  isDraft: boolean
  fieldData: {
    featured: boolean | null
    "thumbnail-image": WebflowImageValue | null
    type: string | null
    tags: string[]
    "available-on": string[]
    "location-2": string[]
    "hours-2": string | null
    "website-link": string | null
    description: string | null
    "member-rate-details": string | null
    "studio-photos": unknown
    "coupon-number": string | null
    "booking-link": string | null
    email: string | null
    name: string | null
    slug: string | null
  }
}

export interface TypeItem {
  id: string
  cmsLocaleId: string
  lastPublished: string | null
  lastUpdated: string | null
  createdOn: string
  isArchived: boolean
  isDraft: boolean
  fieldData: {
    name: string | null
    slug: string | null
  }
}

export interface TierItem {
  id: string
  cmsLocaleId: string
  lastPublished: string | null
  lastUpdated: string | null
  createdOn: string
  isArchived: boolean
  isDraft: boolean
  fieldData: {
    color: string | null
    "ms-id": string | null
    name: string | null
    slug: string | null
  }
}

export interface LocationItem {
  id: string
  cmsLocaleId: string
  lastPublished: string | null
  lastUpdated: string | null
  createdOn: string
  isArchived: boolean
  isDraft: boolean
  fieldData: {
    name: string | null
    slug: string | null
  }
}

export interface TagItem {
  id: string
  cmsLocaleId: string
  lastPublished: string | null
  lastUpdated: string | null
  createdOn: string
  isArchived: boolean
  isDraft: boolean
  fieldData: {
    name: string | null
    slug: string | null
  }
}

export interface CommunityTagItem {
  id: string
  cmsLocaleId: string
  lastPublished: string | null
  lastUpdated: string | null
  createdOn: string
  isArchived: boolean
  isDraft: boolean
  fieldData: {
    name: string | null
    slug: string | null
  }
}

export interface EventItem {
  id: string
  cmsLocaleId: string
  lastPublished: string | null
  lastUpdated: string | null
  createdOn: string
  isArchived: boolean
  isDraft: boolean
  fieldData: {
    thumbnail: WebflowImageValue | null
    date: string | null
    description: string | null
    "button-text": string | null
    "sign-up-url": string | null
    name: string | null
    slug: string | null
  }
}

export const webflowSchema = {
  "site": {
    "id": "69e8e1fae548dc62c873ec55",
    "workspaceId": "69e8d2e621505aee1b8599c6",
    "displayName": "The's Fantabulous Site",
    "shortName": "thes-fantabulous-site-e67dcc",
    "previewUrl": "https://screenshots.webflow.com/sites/69e8e1fae548dc62c873ec55/20260609135001_d170f429f18aaa939fe2d82eb8c89167.png",
    "timeZone": "America/New_York",
    "createdOn": "2026-04-22T14:58:02.275Z",
    "lastUpdated": "2026-06-11T07:35:37.496Z",
    "lastPublished": "2026-06-07T13:11:36.792Z",
    "fullSiteCompiledAt": "2026-06-07T13:11:36.792Z",
    "parentFolderId": null,
    "customDomains": [
      {
        "id": "6a1d57df7c93aeb31459987b",
        "url": "www.joinrevvi.com",
        "lastPublished": "2026-06-09T13:50:01.010Z",
        "fullSiteCompiledAt": "2026-06-09T13:50:01.010Z"
      },
      {
        "id": "6a1d57de7c93aeb314599850",
        "url": "joinrevvi.com",
        "lastPublished": "2026-06-09T13:50:01.010Z",
        "fullSiteCompiledAt": "2026-06-09T13:50:01.010Z"
      }
    ],
    "locales": {
      "primary": {
        "id": "69e8e1fce548dc62c873ed09",
        "cmsLocaleId": "69e8e1fce548dc62c873ed0a",
        "enabled": false,
        "displayName": "English",
        "displayImageId": null,
        "redirect": true,
        "subdirectory": "en",
        "tag": "en"
      },
      "secondary": []
    },
    "dataCollectionEnabled": false,
    "dataCollectionType": "always"
  },
  "collections": [
    {
      "id": "69e8e1fce548dc62c873ed20",
      "displayName": "The Revvi Communities",
      "singularName": "The Revvi Community",
      "slug": "revvi-community",
      "createdOn": "2025-09-11T01:46:04.107Z",
      "lastUpdated": "2026-05-12T09:23:52.109Z",
      "fields": [
        {
          "id": "826cbf78f520c16a3d20fcfd0a726d24",
          "isEditable": true,
          "isRequired": false,
          "type": "Switch",
          "slug": "featured",
          "displayName": "Featured?",
          "helpText": null,
          "validations": null
        },
        {
          "id": "abf862cb780ced5997193689beeae189",
          "isEditable": true,
          "isRequired": false,
          "type": "DateTime",
          "slug": "date",
          "displayName": "Date",
          "helpText": null,
          "validations": null
        },
        {
          "id": "426e5d684e4d9b3084692c06d7550069",
          "isEditable": true,
          "isRequired": false,
          "type": "Reference",
          "slug": "community-tag-2",
          "displayName": "Community Tag",
          "helpText": null,
          "validations": {
            "collectionId": "6a02f0d56e51440522d9abae"
          }
        },
        {
          "id": "1d11f2e803e0dc1a3b21e6e5ad70c3aa",
          "isEditable": true,
          "isRequired": false,
          "type": "Image",
          "slug": "image",
          "displayName": "Image",
          "helpText": null,
          "validations": {
            "maxImageSize": 500
          }
        },
        {
          "id": "efb7e9c2a385aefbc82ca49cedfccee1",
          "isEditable": true,
          "isRequired": false,
          "type": "PlainText",
          "slug": "summary",
          "displayName": "Summary",
          "helpText": "A summary of the blog post that appears on blog post grid",
          "validations": {
            "singleLine": false
          }
        },
        {
          "id": "f2fc1b904f8bfd814cf82b9b20685db0",
          "isEditable": true,
          "isRequired": false,
          "type": "RichText",
          "slug": "body",
          "displayName": "Body",
          "helpText": null,
          "validations": null
        },
        {
          "id": "4dc6fc71fc1331df292343861bfc3b21",
          "isEditable": true,
          "isRequired": false,
          "type": "PlainText",
          "slug": "minutes-to-read",
          "displayName": "Minutes to read",
          "helpText": "Please keep using this format: 10 mins read",
          "validations": {
            "singleLine": true
          }
        },
        {
          "id": "eaf37a7a1f90e8e9f626d624f2bb6254",
          "isEditable": true,
          "isRequired": true,
          "type": "PlainText",
          "slug": "name",
          "displayName": "Title",
          "helpText": null,
          "validations": {
            "maxLength": 256
          }
        },
        {
          "id": "7951f3f8dd04a850a54fecb7bd05687f",
          "isEditable": true,
          "isRequired": true,
          "type": "PlainText",
          "slug": "slug",
          "displayName": "Slug",
          "helpText": null,
          "validations": {
            "maxLength": 256,
            "pattern": {},
            "messages": {
              "pattern": "Must be alphanumerical and not contain any spaces or special characters",
              "maxLength": "Must be less than 256 characters"
            }
          }
        }
      ]
    },
    {
      "id": "69ee2e9c4d86c6ac9e3b490e",
      "displayName": "Partners",
      "singularName": "Partner",
      "slug": "partners",
      "createdOn": "2026-04-26T15:26:20.381Z",
      "lastUpdated": "2026-05-31T09:15:18.189Z",
      "fields": [
        {
          "id": "7327d3548350c711e3b1ecf94c7c0ad6",
          "isEditable": true,
          "isRequired": false,
          "type": "Switch",
          "slug": "featured",
          "displayName": "Featured",
          "helpText": null,
          "validations": null
        },
        {
          "id": "71c8901423197d991ac5713ad3a92676",
          "isEditable": true,
          "isRequired": true,
          "type": "Image",
          "slug": "thumbnail-image",
          "displayName": "Thumbnail image",
          "helpText": null,
          "validations": null
        },
        {
          "id": "d9957a0eca02bdcd71a71922fd1ae3e8",
          "isEditable": true,
          "isRequired": false,
          "type": "Reference",
          "slug": "type",
          "displayName": "Type",
          "helpText": null,
          "validations": {
            "collectionId": "69ee2eaa7ceae1d1329d8bea"
          }
        },
        {
          "id": "63cd82c0794baffb712e98f20737c155",
          "isEditable": true,
          "isRequired": false,
          "type": "MultiReference",
          "slug": "tags",
          "displayName": "Tags",
          "helpText": null,
          "validations": {
            "collectionId": "69f9a160a76de27eb5aafcfd"
          }
        },
        {
          "id": "65894f7e0a47b5e9511e508e85ef5a8f",
          "isEditable": true,
          "isRequired": false,
          "type": "MultiReference",
          "slug": "available-on",
          "displayName": "Available on",
          "helpText": null,
          "validations": {
            "collectionId": "69ee2ee5752d31141e317b74"
          }
        },
        {
          "id": "021479076dfa14be3fc06f96b92f0e4f",
          "isEditable": true,
          "isRequired": false,
          "type": "MultiReference",
          "slug": "location-2",
          "displayName": "Location",
          "helpText": null,
          "validations": {
            "collectionId": "69ee2f3c3ed66d2f103bd622"
          }
        },
        {
          "id": "a0f54fea971e6d6932c5bd58ff78c2da",
          "isEditable": true,
          "isRequired": false,
          "type": "RichText",
          "slug": "hours-2",
          "displayName": "Hours",
          "helpText": "Example format: Mon-Sun / 6am-10pm",
          "validations": null
        },
        {
          "id": "64560ccdc43bc0b160c3536443df2bf2",
          "isEditable": true,
          "isRequired": false,
          "type": "Link",
          "slug": "website-link",
          "displayName": "Website link",
          "helpText": null,
          "validations": null
        },
        {
          "id": "f41dbd34dbaa1cc2ecc432032f5e0e67",
          "isEditable": true,
          "isRequired": false,
          "type": "RichText",
          "slug": "description",
          "displayName": "Description",
          "helpText": null,
          "validations": null
        },
        {
          "id": "fdc4b8bf3fac0035101c174110ddb28e",
          "isEditable": true,
          "isRequired": false,
          "type": "RichText",
          "slug": "member-rate-details",
          "displayName": "Member rate details",
          "helpText": null,
          "validations": null
        },
        {
          "id": "31052bcba68b4cfc98be3f7e83904cd5",
          "isEditable": true,
          "isRequired": false,
          "type": "MultiImage",
          "slug": "studio-photos",
          "displayName": "Studio Photos",
          "helpText": null,
          "validations": null
        },
        {
          "id": "76a909b1af148821858549fbd9db6233",
          "isEditable": true,
          "isRequired": false,
          "type": "PlainText",
          "slug": "coupon-number",
          "displayName": "Coupon number",
          "helpText": null,
          "validations": {
            "singleLine": true
          }
        },
        {
          "id": "a50ceaaeaf50c4c0c23647613b21f725",
          "isEditable": true,
          "isRequired": false,
          "type": "Link",
          "slug": "booking-link",
          "displayName": "Booking link",
          "helpText": null,
          "validations": null
        },
        {
          "id": "896a8016af3ceb7088c0e3d5dfecb44a",
          "isEditable": true,
          "isRequired": false,
          "type": "Email",
          "slug": "email",
          "displayName": "Email",
          "helpText": null,
          "validations": null
        },
        {
          "id": "6014d5bc0af12b3b6e235ebdfb1bbf41",
          "isEditable": true,
          "isRequired": true,
          "type": "PlainText",
          "slug": "name",
          "displayName": "Name",
          "helpText": null,
          "validations": {
            "maxLength": 256
          }
        },
        {
          "id": "2836762447551ebf5cbda9af1206c330",
          "isEditable": true,
          "isRequired": true,
          "type": "PlainText",
          "slug": "slug",
          "displayName": "Slug",
          "helpText": null,
          "validations": {
            "maxLength": 256,
            "pattern": {},
            "messages": {
              "pattern": "Must be alphanumerical and not contain any spaces or special characters",
              "maxLength": "Must be less than 256 characters"
            }
          }
        }
      ]
    },
    {
      "id": "69ee2eaa7ceae1d1329d8bea",
      "displayName": "Types",
      "singularName": "Type",
      "slug": "partner-type",
      "createdOn": "2026-04-26T15:26:34.195Z",
      "lastUpdated": "2026-05-04T09:00:00.612Z",
      "fields": [
        {
          "id": "d179402f292ef8bea9b588f0110a4df5",
          "isEditable": true,
          "isRequired": true,
          "type": "PlainText",
          "slug": "name",
          "displayName": "Name",
          "helpText": null,
          "validations": {
            "maxLength": 256
          }
        },
        {
          "id": "7e6152546f4a2f943f841b83d826f576",
          "isEditable": true,
          "isRequired": true,
          "type": "PlainText",
          "slug": "slug",
          "displayName": "Slug",
          "helpText": null,
          "validations": {
            "maxLength": 256,
            "pattern": {},
            "messages": {
              "pattern": "Must be alphanumerical and not contain any spaces or special characters",
              "maxLength": "Must be less than 256 characters"
            }
          }
        }
      ]
    },
    {
      "id": "69ee2ee5752d31141e317b74",
      "displayName": "Tiers",
      "singularName": "Tier",
      "slug": "tier",
      "createdOn": "2026-04-26T15:27:33.259Z",
      "lastUpdated": "2026-05-23T13:07:38.025Z",
      "fields": [
        {
          "id": "6b5530b5a55985b3b55d6fdd6ea66b9f",
          "isEditable": true,
          "isRequired": false,
          "type": "Color",
          "slug": "color",
          "displayName": "Color",
          "helpText": null,
          "validations": null
        },
        {
          "id": "c20b3fff6864e2d12f2062b90ff32c38",
          "isEditable": true,
          "isRequired": false,
          "type": "PlainText",
          "slug": "ms-id",
          "displayName": "MS ID",
          "helpText": null,
          "validations": {
            "singleLine": true
          }
        },
        {
          "id": "4f00a24bbb9bb8a0e0ddbd6fb3d9df73",
          "isEditable": true,
          "isRequired": true,
          "type": "PlainText",
          "slug": "name",
          "displayName": "Name",
          "helpText": null,
          "validations": {
            "maxLength": 256
          }
        },
        {
          "id": "9b009262ab3601ab429ae3c8b5d6c702",
          "isEditable": true,
          "isRequired": true,
          "type": "PlainText",
          "slug": "slug",
          "displayName": "Slug",
          "helpText": null,
          "validations": {
            "maxLength": 256,
            "pattern": {},
            "messages": {
              "pattern": "Must be alphanumerical and not contain any spaces or special characters",
              "maxLength": "Must be less than 256 characters"
            }
          }
        }
      ]
    },
    {
      "id": "69ee2f3c3ed66d2f103bd622",
      "displayName": "Locations",
      "singularName": "Location",
      "slug": "location",
      "createdOn": "2026-04-26T15:29:00.748Z",
      "lastUpdated": "2026-04-26T15:29:01.017Z",
      "fields": [
        {
          "id": "426a7007f3f643b50cabdfca57ad7cc5",
          "isEditable": true,
          "isRequired": true,
          "type": "PlainText",
          "slug": "name",
          "displayName": "Name",
          "helpText": null,
          "validations": {
            "maxLength": 256
          }
        },
        {
          "id": "fdfabf735553a688cfa35a30b77f794e",
          "isEditable": true,
          "isRequired": true,
          "type": "PlainText",
          "slug": "slug",
          "displayName": "Slug",
          "helpText": null,
          "validations": {
            "maxLength": 256,
            "pattern": {},
            "messages": {
              "pattern": "Must be alphanumerical and not contain any spaces or special characters",
              "maxLength": "Must be less than 256 characters"
            }
          }
        }
      ]
    },
    {
      "id": "69f9a160a76de27eb5aafcfd",
      "displayName": "Tags",
      "singularName": "Tag",
      "slug": "tags",
      "createdOn": "2026-05-05T07:50:56.427Z",
      "lastUpdated": "2026-05-05T07:50:56.961Z",
      "fields": [
        {
          "id": "42d6333bc3a600b2ff892136fc895541",
          "isEditable": true,
          "isRequired": true,
          "type": "PlainText",
          "slug": "name",
          "displayName": "Name",
          "helpText": null,
          "validations": {
            "maxLength": 256
          }
        },
        {
          "id": "27239d7308d0c8abbac61fcd796f5e8d",
          "isEditable": true,
          "isRequired": true,
          "type": "PlainText",
          "slug": "slug",
          "displayName": "Slug",
          "helpText": null,
          "validations": {
            "maxLength": 256,
            "pattern": {},
            "messages": {
              "pattern": "Must be alphanumerical and not contain any spaces or special characters",
              "maxLength": "Must be less than 256 characters"
            }
          }
        }
      ]
    },
    {
      "id": "6a02f0d56e51440522d9abae",
      "displayName": "Community Tags",
      "singularName": "Community Tag",
      "slug": "community-tags",
      "createdOn": "2026-05-12T09:20:21.827Z",
      "lastUpdated": "2026-05-12T09:20:22.172Z",
      "fields": [
        {
          "id": "ab3b470d952e5b8eee5fa54972b69e14",
          "isEditable": true,
          "isRequired": true,
          "type": "PlainText",
          "slug": "name",
          "displayName": "Name",
          "helpText": null,
          "validations": {
            "maxLength": 256
          }
        },
        {
          "id": "d4ab38fe4caf7642c9e02ed3f09428c1",
          "isEditable": true,
          "isRequired": true,
          "type": "PlainText",
          "slug": "slug",
          "displayName": "Slug",
          "helpText": null,
          "validations": {
            "maxLength": 256,
            "pattern": {},
            "messages": {
              "pattern": "Must be alphanumerical and not contain any spaces or special characters",
              "maxLength": "Must be less than 256 characters"
            }
          }
        }
      ]
    },
    {
      "id": "6a132cfd77f832e5f9b55e69",
      "displayName": "Events",
      "singularName": "Event",
      "slug": "events",
      "createdOn": "2026-05-24T16:53:17.158Z",
      "lastUpdated": "2026-05-24T17:11:53.728Z",
      "fields": [
        {
          "id": "bfc77968ea1a8c17aec9b62358c47f96",
          "isEditable": true,
          "isRequired": false,
          "type": "Image",
          "slug": "thumbnail",
          "displayName": "Thumbnail",
          "helpText": null,
          "validations": null
        },
        {
          "id": "2ba9b8ba0ef4d9e9a182819e527b385c",
          "isEditable": true,
          "isRequired": false,
          "type": "DateTime",
          "slug": "date",
          "displayName": "Date",
          "helpText": null,
          "validations": null
        },
        {
          "id": "e93910cf9941eb7a0365595be018e7b7",
          "isEditable": true,
          "isRequired": false,
          "type": "RichText",
          "slug": "description",
          "displayName": "Description",
          "helpText": null,
          "validations": null
        },
        {
          "id": "0c6226fce68b02e20854d50e721afb50",
          "isEditable": true,
          "isRequired": false,
          "type": "PlainText",
          "slug": "button-text",
          "displayName": "Button text",
          "helpText": null,
          "validations": {
            "singleLine": true
          }
        },
        {
          "id": "93fed7f98855cd5b5869cb9e32c01c0d",
          "isEditable": true,
          "isRequired": false,
          "type": "Link",
          "slug": "sign-up-url",
          "displayName": "Sign up URL",
          "helpText": null,
          "validations": null
        },
        {
          "id": "489cd5a1e3e9a03aa8504eb75d8d9a2c",
          "isEditable": true,
          "isRequired": true,
          "type": "PlainText",
          "slug": "name",
          "displayName": "Name",
          "helpText": null,
          "validations": {
            "maxLength": 256
          }
        },
        {
          "id": "81e922df384bf213cb528acff4f141ac",
          "isEditable": true,
          "isRequired": true,
          "type": "PlainText",
          "slug": "slug",
          "displayName": "Slug",
          "helpText": null,
          "validations": {
            "maxLength": 256,
            "pattern": {},
            "messages": {
              "pattern": "Must be alphanumerical and not contain any spaces or special characters",
              "maxLength": "Must be less than 256 characters"
            }
          }
        }
      ]
    }
  ]
} as const
