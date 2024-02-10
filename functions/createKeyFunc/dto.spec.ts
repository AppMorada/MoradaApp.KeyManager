import { ZodError } from "zod"
import { CreateKeyFuncDTO } from "./dto"

describe('Create Key Func DTO test', () => {
  it('should be able to validate a create func request body', () => {
    const body = {
      name: 'na',
      ttl: 1
    }

    expect(CreateKeyFuncDTO.exec(body)).toBeTruthy()
  })

  it('should throw one error - should have at the requested fields', () => {
    expect(() => CreateKeyFuncDTO.exec(undefined)).toThrow(ZodError)
  })


  it('should throw one error - name does not match', () => {
    const body1 = {
      name: 'a',
      ttl: 1
    }

    const body2 = {
      name: 'a'.repeat(256),
      ttl: 1
    }

    const body3 = {
      name: undefined,
      ttl: 1
    }

    expect(() => CreateKeyFuncDTO.exec(body1)).toThrow(ZodError)
    expect(() => CreateKeyFuncDTO.exec(body2)).toThrow(ZodError)
    expect(() => CreateKeyFuncDTO.exec(body3)).toThrow(ZodError)
  })

  it('should throw one error - ttl does not match', () => {
    const body1 = {
      name: 'name',
      ttl: 0
    }

    const body2 = {
      name: 'name',
      ttl: undefined
    }

    expect(() => CreateKeyFuncDTO.exec(body1)).toThrow(ZodError)
    expect(() => CreateKeyFuncDTO.exec(body2)).toThrow(ZodError)
  })
})
