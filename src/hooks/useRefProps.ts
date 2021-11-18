import { useRef } from 'react';
import type { MutableRefObject } from 'react';

/**
 * 引用最新的props
 * @param props
 * @example
   const propsRef = useRefProps(props)
   const handleClick = useCallback(() => {
     const { onClick } = propsRef.current
   }, [])
 */
function useRefProps<PropType>(props: PropType): MutableRefObject<PropType> {
  const ref = useRef<PropType>(props);
  ref.current = props;
  return ref;
}

export default useRefProps;
