import { IStory } from '../../db/interface/IStory.interface'
import { Model } from 'mongoose'
import { DataBaseService } from './db-service.repository'
import { TStory } from '../../db/types/document.type'
import { StoryModel } from '../../db/models/Story/Story.model'

class StoryRepository extends DataBaseService<IStory, TStory> {
  constructor(protected readonly storyModel: Model<TStory> = StoryModel) {
    super(storyModel)
  }
}

export default new StoryRepository()
