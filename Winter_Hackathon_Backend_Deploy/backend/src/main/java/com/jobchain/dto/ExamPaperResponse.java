package com.jobchain.dto;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.util.List;
import java.util.Map;

@Setter
@Getter
@AllArgsConstructor
@NoArgsConstructor
public class ExamPaperResponse {
    private List<QuestionDto> questions;
    private Map<String, String> markingScheme;
}

