import React, { useState, useEffect } from 'react';
import { Input, Dropdown, Menu, Button } from 'antd';
import { SearchOutlined } from '@ant-design/icons';
import { searchContacts } from '../../../../services/products';
import { debounce } from '../../../../utils/common.utils';

interface ProductSearchProps {
    onSearch: (query: string) => void;
}

const ProductSearch: React.FC<ProductSearchProps> = ({ onSearch }) => {
    const [searchTerm, setSearchTerm] = useState('');
    const [suggestions, setSuggestions] = useState<string[]>([]);
    const [loading, setLoading] = useState(false);

    const fetchSuggestions = async () => {
                setLoading(true);
                try {
                    const data: any = await searchContacts({ searchTerm });
                    setSuggestions(data?.data?.results || []);
                } catch (error) {
                    console.error('Error fetching suggestions:', error);
                } finally {
                    setLoading(false);
                }
        };

    useEffect(() => {
        const debouncedFetchSuggestions = debounce(fetchSuggestions, 300);
        debouncedFetchSuggestions();
    }, [searchTerm]);

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setSearchTerm(e.target.value);
    };

    const handleMenuClick = (selectedTerm: number) => {
        const query = {
            contact: selectedTerm,
        }
        onSearch(JSON.parse(JSON.stringify({ ...query })));
    };

    const menu = (
        <Menu style={{ maxHeight: '200px', overflowY: 'auto' }} >
            {loading && <Menu.Item disabled>Loading...</Menu.Item>}
            {suggestions?.map((item: any) => (
                <Menu.Item key={item.id} onClick={() => handleMenuClick(item.id)}>
                    {item.company_name}
                </Menu.Item>
            ))}
        </Menu>
    );

    const handleReset = () => {
        setSearchTerm('');
        onSearch('');
    };

    return (
        <div style={{ display: 'flex', alignItems: 'center' }}>
            <Dropdown overlay={menu} trigger={['click']} >
                <Input
                    style={{ width: '25%', marginRight: '8px' }}
                    placeholder="Search Contacts"
                    value={searchTerm}
                    onClick={fetchSuggestions}
                    onChange={handleInputChange}
                    suffix={<SearchOutlined />}
                />
            </Dropdown>
            <Button onClick={handleReset} >Reset</Button>
        </div>
    );
};

export default ProductSearch;
