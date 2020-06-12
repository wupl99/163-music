import require from '@/utils/require';

export function getPlaylist(oParams){
  return require.get('/playlist/detail', {
    params: oParams.params
  });
};

export function getCommentPlaylist(oParams){
  return require.get('/comment/playlist', {
    params: oParams.params
  });
};
