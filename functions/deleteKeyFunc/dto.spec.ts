import { DeleteKeyFuncDTO } from "./dto"
import { ZodError } from "zod"

describe('Delete Key Func DTO test', () => {
  it("should be able to validate a delete key request", () => {
    const params = {
      '0': encodeURIComponent("Não é o John Doe")
    }

    expect(typeof DeleteKeyFuncDTO.exec({ params }) === 'string').toBe(true)
  })

  it("should throw one error - unknown error", () => {
    expect(() => DeleteKeyFuncDTO.exec({ params: undefined })).toThrow(ZodError)
  })
})
