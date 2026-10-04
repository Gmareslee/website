import { defineConfig } from 'tinacms';

// Branch adını sabitliyoruz (Node.js process uyarısını engeller)
const branch = 'main';

export default defineConfig({
  branch,

  // TinaCloud Kimlik Bilgilerin
  clientId: "329e48e0-91e0-4f9d-b475-7b70ea4af125",
  token: "d6f51c72f1e40c6c770c0c79435b6c813be2be22",

  build: {
    outputFolder: 'admin',
    publicFolder: '', // Projende public klasörü olmadığı için kök dizin olarak boş bıraktık
  },
  media: {
    tina: {
      mediaRoot: 'images',
      publicFolder: '',
    },
  },
  schema: {
    collections: [
      {
        name: 'post',
        label: 'Posts',
        path: 'content/posts',
        fields: [
          {
            type: 'string',
            name: 'title',
            label: 'Title',
            isTitle: true,
            required: true,
          },
          {
            type: 'rich-text',
            name: 'body',
            label: 'Body',
            isBody: true,
          },
        ],
      },
    ],
  },
});