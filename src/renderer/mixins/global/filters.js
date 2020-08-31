import Lists from '@/mixins/lists/lists.js'

export default {
  mixins: [Lists],

  computed: {
    entries () {
      const filterKeys = Object.keys(this.filterModel)
      const emptyValue = 'none'

      return this.originalEntries.filter((entry) => {
        const selected = []

        for (const key of filterKeys) {
          const filterValue = this.filterModel[key]
          const isArray = Array.isArray(filterValue)

          if (!filterValue || (isArray && !filterValue.length)) {
            selected.push(emptyValue)
            continue
          }

          if (key === 'list') {
            const isSelected = filterValue.some(({ value }) => {
              // Comes from the lists mixins
              return this.getList(value)
                .some(({ title, name }) => entry.title === title || entry.title === name)
            })

            selected.push(isSelected)
            continue
          }

          if (isArray) {
            const isSelected = Array.isArray(entry[key])
              // The entry is selected if it has at least one matching value
              ? !!entry[key].filter((val) => filterValue.some((v) => v === val)).length
              : filterValue.includes(entry[key])

            selected.push(isSelected)
          } else {
            selected.push(
              (key === 'score' && entry[key] > filterValue) ||
              entry[key] === filterValue
            )
          }
        }

        return selected.filter((v) => v !== emptyValue).every((v) => v === true) || selected.every((v) => v === emptyValue)
      })
    }
  }
}
