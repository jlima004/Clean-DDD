import { AnswersRepository } from '../repositories/answers-repository'
import { QuestionsRepository } from '@/domain/forum/aplication/repositories/questions-repository'
import { Question } from '../../enterprise/entities/question'

interface ChoseQuestionBestAnswerUseCaseRequest {
  answerId: string
  authorId: string
}

interface ChoseQuestionBestAnswerUseCaseResponse {
  question: Question
}

export class ChoseQuestionBestAnswerUseCase {
  constructor(
    private questionsRepository: QuestionsRepository,
    private answersRepository: AnswersRepository,
  ) {}

  async execute({
    answerId,
    authorId,
  }: ChoseQuestionBestAnswerUseCaseRequest): Promise<ChoseQuestionBestAnswerUseCaseResponse> {
    const answer = await this.answersRepository.findById(answerId)

    if (!answer) throw new Error('Answer not found.')

    const question = await this.questionsRepository.findById(
      answer.questionId.toString(),
    )

    if (!question) throw new Error('Question not found.')

    if (authorId !== question.authorId.toString()) {
      throw new Error('Not allowed.')
    }

    question.bestAnswerId = answer.id

    const updatedQuestion = await this.questionsRepository.save(question)

    return { question: updatedQuestion }
  }
}
