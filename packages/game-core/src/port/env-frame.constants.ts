/* @layer bridge-wasm @kind constants */
/* The Edge Effect's environment picture (core/wasm-build/ck_api.c, core/reconnect/edge_env_reconnect.c) */
const CK_EXPORT_SET_EDGE_ENV = 'CkSetEdgeEnv';
const CK_EXPORT_ENV_VALID = 'CkEnvValid';
const CK_EXPORT_ENV_PTR = 'CkEnvPtr';
const CK_EXPORT_ENV_WIDTH = 'CkEnvWidth';
const CK_EXPORT_ENV_HEIGHT = 'CkEnvHeight';
const CK_ENV_BYTES_PER_PIXEL = 4;

export {
  CK_ENV_BYTES_PER_PIXEL, CK_EXPORT_ENV_HEIGHT, CK_EXPORT_ENV_PTR, CK_EXPORT_ENV_VALID, CK_EXPORT_ENV_WIDTH,
  CK_EXPORT_SET_EDGE_ENV,
};
