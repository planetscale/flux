import Select from 'react-select';

const customStyles = {
  container: provided => ({
    ...provided,
    width: '200px',
  }),
  control: provided => ({
    ...provided,
    borderColor: 'unset',
    borderRadius: 'unset',
    borderStyle: 'unset',
    borderWidth: 'unset',
    boxShadow: 'unset',
    backgroundColor: 'var(--accent3)',
    borderRadius: '5px',
  }),
  indicatorSeparator: provided => ({
    ...provided,
    backgroundColor: 'var(--background)',
    marginBottom: '0',
    marginTop: '0',
  }),
  indicatorContainer: provided => ({
    ...provided,
    color: 'var(--foreground)',
  }),
  option: provided => ({
    ...provided,
    whiteSpace: 'nowrap',
    color: 'var(--text)',
    ':hover': {
      backgroundColor: 'var(--accent)',
    },
  }),
  singleValue: provided => ({
    ...provided,
    color: 'var(--text)',
  }),
  menu: provided => ({
    ...provided,
    backgroundColor: 'var(--background)',
    border: '1px solid var(--accent)',
    borderRadius: '8px',
    boxShadow: 'var(--shadow)',
    width: 'unset',
  }),
};

export default function TagSelector({
  tagOptions,
  selectedTag,
  tagChangeCallback,
}) {
  return (
    <Select
      isClearable={true}
      isSearchable={true}
      styles={customStyles}
      value={selectedTag}
      onChange={tagChangeCallback}
      options={tagOptions}
      defaultValue={selectedTag}
      placeholder="Select a tag"
      theme={theme => ({
        ...theme,
        colors: {
          ...theme.colors,
          primary25: 'var(--highlight)',
          primary50: 'var(--highlight)',
          primary75: 'var(--highlight)',
          primary: 'var(--highlight)',
        },
      })}
    />
  );
}
