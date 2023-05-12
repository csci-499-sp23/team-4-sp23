/**
 * @returns {{id,[key:string]:any} }
 */
export function docToJson(doc) {
  return ({ id: doc.id, ...doc.data() });
}

export const MessageKey = {
  GUEST_INDEX: 0,
  HOST_INDES: 1
}

/*
 * @description deferred allows you to update or set the value of a promise 
  from outside the scope of the promise
  cons setPromiseValueFromOutside
  const someValueOfPromise = new Promise((resolve,reject)=> {
    // resolve('every one can smile')
    setPromiseValueFromOutside = resolve
  })

  setPromiseValueFromOutside('hey,, we ouuuuuuuutsidddde')
  console.log(await someValueOfPromise )


 * @returns 
 */
/** @template T */
export function makeDeferred(T) {

  /** @type {promise: Promise<T|any>,res:(value)=>void,rej:(value)=>void} */
  let deferedHandler = { promise: null, res: null, rej: null };

  /** @type {Promise<T>} */
  let promise = new Promise((res, rej) => {
    deferedHandler = { res, rej }
  })

  return {
    promise,
    ...deferedHandler
  }
}