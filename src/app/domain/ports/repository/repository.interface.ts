import { IReaderRepository } from "./reader.interface"
import { IWriter } from "./writer.interface"

/**
 * Base Repository
 *
 * @interface
 */
export interface IBaseRepository<I> extends IReaderRepository<I>, IWriter<I> {

}