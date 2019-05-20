export default {
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
