function SortBy({
  sortBy,
  sortDirection,
  onSortByChange,
  onSortDirectionChange,
}) {
  return (
    <div>
      <div>
        <label htmlFor="sort-by">
          Sort by
        </label>

        <select
          id="sort-by"
          value={sortBy}
          onChange={(event) =>
            onSortByChange(event.target.value)
          }
        >
          <option value="creationDate">
            Creation Date
          </option>

          <option value="title">
            Title
          </option>
        </select>
      </div>

      <div>
        <label htmlFor="sort-direction">
          Order
        </label>

        <select
          id="sort-direction"
          value={sortDirection}
          onChange={(event) =>
            onSortDirectionChange(event.target.value)
          }
        >
          <option value="desc">
            Descending
          </option>

          <option value="asc">
            Ascending
          </option>
        </select>
      </div>
    </div>
  );
}

export default SortBy;