export async function resolvePromise<T>(
  promiseToResolve: Promise<T>
): Promise<[data: T, error: any]> {
  try {
    const data = await promiseToResolve;
    return [data, null];
  } catch (err) {
    return [null as any, err];
  }
}
