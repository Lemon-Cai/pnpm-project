import { provide, ref } from 'vue';  
  
const useApp = () => {  
  const data = ref([1, 1,2,4]);  
  provide('data', data);  
  return {
    data
  }
};  

export default useApp