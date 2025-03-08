import {useState, useEffect, SetStateAction} from 'react';

const useSearch = (data: any[], field: string, delay = 500) => {
  const [searchText, setSearchText] = useState('');
  const [searchResults, setSearchResults] = useState<any>([]);

  useEffect(() => {
    const debounceTimer = setTimeout(() => {
      const results: any[] = data?.filter((item: {[x: string]: string}) =>
        item[field].toLowerCase().includes(searchText.toLowerCase()),
      );

      setSearchResults(results);
    }, delay);

    return () => clearTimeout(debounceTimer);
  }, [searchText, data, delay, field]);

  const handleSearch = (text: SetStateAction<string>) => {
    setSearchText(text);
  };

  return {
    searchText,
    handleSearch,
    searchResults,
  };
};

export default useSearch;
