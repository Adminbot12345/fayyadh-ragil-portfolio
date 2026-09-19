export type SkillKind = 'skill' | 'software'
export type Skill = {
  id: string
  name: string
  kind: SkillKind
  isVisible: boolean
  sortOrder: number
  createdAt: string
  updatedAt: string
}
