import { expect } from 'chai'
import 'mocha'
import { msg } from './index'

describe('testing test', () => {
    it('should return HELLO ts-node', () => {
        expect(true).to.eq(true)
    })
    it('should return HELLO ts-node', () => {
        expect(msg()).to.eq('HELLO ts-node + test')
    })
})
