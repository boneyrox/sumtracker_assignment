import { FC, useEffect, useState , useRef} from "react";
import ResultString from "../../../components/content/result.content";
import Heading from "../../../components/heading/basic.heading";
import Pagination from "../../../components/pagination/basic.pagination";
import { PAGINATION_LIMIT } from "../../../constants/app.constants";
import { PaginateDataType, UrlType } from "../../../interface/common";
import { listProducts } from "../../../services/products";
import { getQueryFromUrl } from "../../../utils/common.utils";
import ProductsTable from "./components/products.table";
import ProductSearch from "./components/product.search"
import { useNavigate , useLocation} from "react-router-dom";

const ProductList: FC = () => {
    const [products, setProducts] = useState<any[]>([]);
    const [loading, setLoading] = useState<boolean>(false);
    const [pagination, setPagination] = useState<PaginateDataType>({
        next: null,
        prev: null,
        count: null,
        resultsCount: 0,
        offset: null,
        hasOffset: true,
        limit: PAGINATION_LIMIT
    });
    const navigate = useNavigate();
    const location = useLocation();
    const prevLocation = useRef<string | null>(null);
    

    useEffect(() => {
        const queryParams = getQueryFromUrl(window.location.href);
        const currentLocation = location.pathname + location.search;

        if (currentLocation !== prevLocation.current) {
            loadProducts(queryParams);
            prevLocation.current = currentLocation;
        }
    }, [location]);

    // Optimized function to load products
    const loadProducts = async (queryParams?: Record<string, any>) => {
        setLoading(true);
        try {
            const fixedListParams: any = {
                paginate: true,
            };
            const resolution: any = await listProducts({ ...fixedListParams, ...queryParams });
            const url = resolution?.url ? new URL(resolution.url) : null;
            if (url) {
                const path = url.pathname + url.search;
                navigate(path);
            }
            const res = resolution.data;
            if (res?.results) {
                setProducts(res?.results);

                setPagination(prev => ({
                    ...prev,
                    next: res.next,
                    prev: res.previous,
                    count: res.count,
                    resultsCount: res.results.length,
                    offset: queryParams?.offset ? Number(queryParams.offset) : null,
                }));
            }

        } catch (err) {
            console.log(err);
        }
        setLoading(false);
    }

    const handleNext = (next: UrlType) => {
        if (next === null) {
            return;
        }
        const queryParams = getQueryFromUrl(next);
        loadProducts(queryParams);
    }

    const handlePrev = (prev: UrlType) => {
        if (prev === null) {
            return;
        }
        const queryParams = getQueryFromUrl(prev);
        loadProducts(queryParams);
    }

    return (
        <>
            <div style={{ marginBottom: '1rem' }}>
                <Heading titleLevel={2}>Products</Heading>
            </div>
            <div style={{ backgroundColor: 'white', padding: '0.5rem' }}>
                <div style={{ marginBottom: '1rem' }}>
                    <ProductSearch onSearch={(query:any)=>loadProducts(query)} />
                </div>
                <div style={{ marginBottom: '1rem' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                        <div>
                            <ResultString loading={loading} pagination={pagination} pageString={'product'} />
                        </div>
                        <div>
                            <Pagination next={pagination.next} prev={pagination.prev} onNextClick={handleNext} onPrevClick={handlePrev} />
                        </div>
                    </div>
                </div>
                <div style={{ marginBottom: '1rem' }}>
                    <ProductsTable list={products} loading={loading} />
                </div>
                <div>
                    <Pagination next={pagination.next} prev={pagination.prev} onNextClick={handleNext} onPrevClick={handlePrev} />
                </div>
            </div>
        </>
    )
}

export default ProductList;