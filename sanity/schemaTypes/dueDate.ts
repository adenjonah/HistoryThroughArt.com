import {defineField, defineType} from 'sanity'

export default defineType({
  name: 'dueDate',
  title: 'Due Date',
  type: 'document',
  fields: [
    defineField({
      name: 'type',
      title: 'Type',
      type: 'string',
      options: {
        list: [
          {title: 'Artwork Assignment', value: 'artwork'},
          {title: 'Event', value: 'event'},
          {title: 'Quiz', value: 'quiz'},
        ],
        layout: 'radio',
      },
      validation: (Rule) => Rule.required(),
      initialValue: 'artwork',
    }),
    defineField({
      name: 'artwork',
      title: 'Artwork',
      type: 'reference',
      to: [{type: 'artwork'}],
      description: 'Select the artwork for this assignment',
      hidden: ({parent}) => parent?.type !== 'artwork',
    }),
    defineField({
      name: 'title',
      title: 'Title',
      type: 'string',
      description: 'Event or quiz title',
      hidden: ({parent}) => parent?.type === 'artwork',
    }),
    defineField({
      name: 'dueDate',
      title: 'Due Date',
      type: 'date',
      options: {
        dateFormat: 'MMMM D, YYYY',
      },
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'notes',
      title: 'Notes',
      type: 'text',
      description: 'Optional notes or instructions',
      rows: 3,
    }),
  ],
  orderings: [
    {
      title: 'Due Date (Ascending)',
      name: 'dueDateAsc',
      by: [{field: 'dueDate', direction: 'asc'}],
    },
    {
      title: 'Due Date (Descending)',
      name: 'dueDateDesc',
      by: [{field: 'dueDate', direction: 'desc'}],
    },
    {
      title: 'Type',
      name: 'typeAsc',
      by: [{field: 'type', direction: 'asc'}],
    },
  ],
  preview: {
    select: {
      type: 'type',
      title: 'title',
      artworkName: 'artwork.name',
      artworkId: 'artwork.id',
      dueDate: 'dueDate',
    },
    prepare({type, title, artworkName, artworkId, dueDate}) {
      const displayTitle = type === 'artwork' ? `${artworkId}. ${artworkName}` : title

      return {
        title: displayTitle || 'Untitled',
        subtitle: dueDate
          ? new Date(dueDate).toLocaleDateString('en-US', {
              month: 'short',
              day: 'numeric',
              year: 'numeric',
            })
          : 'No date set',
      }
    },
  },
})
