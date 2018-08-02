
export function raceToSuccess (promises) {
  return Promise.all(
    promises.map(p =>
      // If a request fails, count that as a resolution so it will keep
      // waiting for other possible successes. If a request succeeds,
      // treat it as a rejection so Promise.all immediately bails out.
      p.then(val => Promise.reject(val), err => err)
    )
  ).then(
    // If '.all' resolved, we've just got an array of errors.
    errors => Promise.reject(errors),
    // If '.all' rejected, we've got the result we wanted.
    val => val
  )
}
