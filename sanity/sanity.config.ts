import {defineConfig} from 'sanity'
import {structureTool} from 'sanity/structure'
import {visionTool} from '@sanity/vision'
import {schemaTypes} from './schemaTypes'

export default defineConfig({
  name: 'default',
  title: 'History Through Art',

  projectId: 'o12a3h5d',
  dataset: 'production',

  plugins: [
    structureTool({
      structure: (S) =>
        S.list()
          .title('Content')
          .items([
            S.listItem()
              .title('Artworks')
              .schemaType('artwork')
              .child(
                S.documentTypeList('artwork')
                  .title('Artworks')
                  .defaultOrdering([{field: 'id', direction: 'asc'}])
              ),
            S.divider(),
            S.listItem()
              .title('All Due Dates')
              .schemaType('dueDate')
              .child(
                S.documentTypeList('dueDate')
                  .title('Due Dates')
                  .defaultOrdering([{field: 'dueDate', direction: 'asc'}])
              ),
            S.listItem()
              .title('Assignments')
              .child(
                S.documentList()
                  .title('Artwork Assignments')
                  .filter('_type == "dueDate" && type == "artwork"')
                  .defaultOrdering([{field: 'dueDate', direction: 'asc'}])
              ),
            S.listItem()
              .title('Events')
              .child(
                S.documentList()
                  .title('Events')
                  .filter('_type == "dueDate" && type == "event"')
                  .defaultOrdering([{field: 'dueDate', direction: 'asc'}])
              ),
            S.listItem()
              .title('Quizzes')
              .child(
                S.documentList()
                  .title('Quizzes')
                  .filter('_type == "dueDate" && type == "quiz"')
                  .defaultOrdering([{field: 'dueDate', direction: 'asc'}])
              ),
          ]),
    }),
    visionTool(),
  ],

  schema: {
    types: schemaTypes,
  },
})
