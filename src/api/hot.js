import require from '@/utils/require';

export function getHot(oParams){
  return require.get('/top/list?idx=1', {
    params: oParams.params
  });
};
