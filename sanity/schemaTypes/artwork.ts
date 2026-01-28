import {defineField, defineType} from 'sanity'

export default defineType({
  name: 'artwork',
  title: 'Artwork',
  type: 'document',
  fields: [
    defineField({
      name: 'id',
      title: 'ID',
      type: 'number',
      description: 'Unique artwork identifier (1-250)',
      validation: (Rule) => Rule.required().integer().positive(),
    }),
    defineField({
      name: 'name',
      title: 'Name',
      type: 'string',
      description: 'Artwork title',
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'location',
      title: 'Location Made',
      type: 'string',
      description: 'Where the artwork was created',
    }),
    defineField({
      name: 'artistCulture',
      title: 'Artist/Culture',
      type: 'string',
      description: 'Artist name or cultural group (use "None" if unknown)',
    }),
    defineField({
      name: 'dateRange',
      title: 'Date Range',
      type: 'object',
      description: 'Creation date range. Use negative numbers for BCE (e.g., -25500 for 25500 BCE)',
      fields: [
        defineField({
          name: 'startYear',
          title: 'Start Year',
          type: 'number',
          description: 'Start year (negative for BCE)',
          validation: (Rule) => Rule.required().integer(),
        }),
        defineField({
          name: 'endYear',
          title: 'End Year',
          type: 'number',
          description: 'End year (negative for BCE). Same as start for single year.',
          validation: (Rule) => Rule.required().integer(),
        }),
      ],
    }),
    defineField({
      name: 'materials',
      title: 'Materials',
      type: 'string',
      description: 'Medium or materials used',
    }),
    defineField({
      name: 'unit',
      title: 'Unit (Content Area)',
      type: 'number',
      description: 'AP Art History unit number',
      options: {
        list: [
          {title: 'Unit 1: Global Prehistory', value: 1},
          {title: 'Unit 2: Ancient Mediterranean', value: 2},
          {title: 'Unit 3: Early Europe and Colonial Americas', value: 3},
          {title: 'Unit 4: Later Europe and Americas', value: 4},
          {title: 'Unit 5: Indigenous Americas', value: 5},
          {title: 'Unit 6: Africa', value: 6},
          {title: 'Unit 7: West and Central Asia', value: 7},
          {title: 'Unit 8: South, East, and Southeast Asia', value: 8},
          {title: 'Unit 9: The Pacific', value: 9},
          {title: 'Unit 10: Global Contemporary', value: 10},
        ],
      },
      validation: (Rule) => Rule.required().min(1).max(10),
    }),
    defineField({
      name: 'museum',
      title: 'Museum/Current Location',
      type: 'string',
      description: 'Where the artwork is currently displayed',
    }),
    defineField({
      name: 'displayedLocation',
      title: 'Display City',
      type: 'string',
      description: 'City and country where artwork is displayed',
    }),
    defineField({
      name: 'displayedCoordinates',
      title: 'Display Coordinates',
      type: 'object',
      description: 'Map coordinates for current display location',
      fields: [
        defineField({
          name: 'latitude',
          title: 'Latitude',
          type: 'number',
          validation: (Rule) => Rule.min(-90).max(90),
        }),
        defineField({
          name: 'longitude',
          title: 'Longitude',
          type: 'number',
          validation: (Rule) => Rule.min(-180).max(180),
        }),
      ],
    }),
    defineField({
      name: 'originatedCoordinates',
      title: 'Origin Coordinates',
      type: 'object',
      description: 'Map coordinates for where artwork was created',
      fields: [
        defineField({
          name: 'latitude',
          title: 'Latitude',
          type: 'number',
          validation: (Rule) => Rule.min(-90).max(90),
        }),
        defineField({
          name: 'longitude',
          title: 'Longitude',
          type: 'number',
          validation: (Rule) => Rule.min(-180).max(180),
        }),
      ],
    }),
    defineField({
      name: 'images',
      title: 'Images',
      type: 'array',
      of: [
        {
          type: 'image',
          options: {
            hotspot: true,
          },
        },
      ],
      description: 'Artwork images (drag to reorder)',
    }),
    defineField({
      name: 'videos',
      title: 'Videos',
      type: 'array',
      of: [
        {
          type: 'object',
          name: 'video',
          title: 'Video',
          fields: [
            defineField({
              name: 'url',
              title: 'YouTube URL',
              type: 'url',
              description: 'YouTube embed URL (e.g., https://www.youtube.com/embed/VIDEO_ID)',
            }),
            defineField({
              name: 'transcript',
              title: 'Transcript',
              type: 'array',
              of: [
                {
                  type: 'object',
                  name: 'transcriptEntry',
                  title: 'Transcript Entry',
                  fields: [
                    defineField({
                      name: 'start',
                      title: 'Start Time (seconds)',
                      type: 'number',
                    }),
                    defineField({
                      name: 'end',
                      title: 'End Time (seconds)',
                      type: 'number',
                    }),
                    defineField({
                      name: 'text',
                      title: 'Text',
                      type: 'string',
                    }),
                  ],
                },
              ],
            }),
          ],
        },
      ],
    }),
  ],
  orderings: [
    {
      title: 'ID',
      name: 'idAsc',
      by: [{field: 'id', direction: 'asc'}],
    },
    {
      title: 'Unit',
      name: 'unitAsc',
      by: [{field: 'unit', direction: 'asc'}],
    },
    {
      title: 'Name',
      name: 'nameAsc',
      by: [{field: 'name', direction: 'asc'}],
    },
  ],
  preview: {
    select: {
      title: 'name',
      id: 'id',
      unit: 'unit',
      media: 'images.0',
    },
    prepare({title, id, unit, media}) {
      return {
        title: `${id}. ${title}`,
        subtitle: `Unit ${unit}`,
        media,
      }
    },
  },
})
